import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, ImageRun, AlignmentType, WidthType } from "docx";
import { saveAs } from 'file-saver';
import { Order } from "./types";

const SERVICE_TITLES: Record<string, string> = {
    foundation: 'Фундаментные работы',
    drainage: 'Дренажные системы',
    earthwork: 'Земляные работы',
    farm_building: 'Сельскохозяйственные здания',
    greenhouse: 'Тепличные комплексы',
    landscape: 'Благоустройство территории',
    livestock: 'Животноводческие комплексы',
    road: 'Дорожные работы',
    storage: 'Здания для хранения продукции',
};

export const generateOrderDocument = async (order: Order): Promise<void> => {
    try {
        // 1. Загрузка логотипа компании
        const logoResponse = await fetch('/images/docx_logo.png');
        const logoData = await logoResponse.arrayBuffer();
        const companyLogo = new ImageRun({
            type: 'png',
            data: logoData,
            transformation: {
                width: 100,
                height: 100,
            }
        });

        // 2. Формирование структуры документа
        const documentContent = [
            // Шапка документа с логотипом
            new Paragraph({
                children: [companyLogo],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
            }),

            // Название документа
            new Paragraph({
                text: `Техническое задание №${order.id}`,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            }),

            // Блок основной информации
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    createTableRow('Вид услуги', SERVICE_TITLES[order.serviceType] || order.serviceType),
                    createTableRow('Дата оформления', order.createdAt ? 
                        new Date(order.createdAt).toLocaleDateString('ru-RU') : 'не указана'),
                ],
            }),

            // Блок контактных данных
            createSectionHeader('Контактные данные'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    createTableRow('Заказчик', order.user?.name),
                    createTableRow('Контактный телефон', formatPhoneNumber(order.user?.phone)),
                    createTableRow('Электронная почта', order.user?.email),
                    createTableRow('Предпочтительный способ связи', order.contactInfo?.contactMethod),
                    createTableRow('Удобное время для связи', order.contactInfo?.callTime),
                ],
            }),

            // Блок параметров проекта
            createSectionHeader('Параметры проекта'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    createTableRow('Бюджет проекта', formatBudget(order.projectDetails?.general?.budget)),
                    createTableRow('Местоположение объекта', order.projectDetails?.general?.location),
                    createTableRow('Планируемые сроки реализации', order.projectDetails?.general?.timing),
                    createTableRow('Дополнительные комментарии', order.projectDetails?.general?.comments || 'отсутствуют'),
                ],
            }),

            // Блок технических требований
            createSectionHeader('Технические требования'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: getTechnicalSpecifications(order),
            }),
        ];

        // 3. Генерация документа
        const doc = new Document({
            styles: {
                paragraphStyles: [
                    {
                        id: "BoldText",
                        name: "Bold Text",
                        run: {
                            bold: true,
                        },
                        paragraph: {
                            spacing: { line: 276 },
                        },
                    },
                ],
            },
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1000,
                            right: 1000,
                            bottom: 1000,
                            left: 1000,
                        },
                    },
                },
                children: documentContent,
            }],
        });

        // 4. Экспорт документа
        const documentBlob = await Packer.toBlob(doc);
        saveAs(documentBlob, `Техническое_задание_${order.id}.docx`);

    } catch (error) {
        console.error('Ошибка генерации документа:', error);
        throw new Error('Произошла ошибка при формировании документа');
    }
};

// Вспомогательные функции
function createTableRow(label: string, value?: string | number): TableRow {
    return new TableRow({
        children: [
            new TableCell({
                children: [new Paragraph({ text: label, style: 'BoldText' })],
                width: { size: 35, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({ text: value?.toString() || 'не указано' })],
                width: { size: 65, type: WidthType.PERCENTAGE },
            }),
        ],
    });
}

function createSectionHeader(text: string): Paragraph {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
    });
}

function formatPhoneNumber(phone?: string): string {
    if (!phone) return 'не указан';
    return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
}

function formatBudget(amount?: string | number): string {
    if (!amount) return 'не указан';
    return typeof amount === 'number' ? 
        `${amount.toLocaleString('ru-RU')} руб.` : 
        amount;
}

function getTechnicalSpecifications(order: Order): TableRow[] {
    const specifications: TableRow[] = [];
    const details = order.projectDetails;

    const formatList = (items?: any[], separator = ', ') => 
        items?.filter(Boolean).join(separator) || 'не указано';

    switch (order.serviceType) {
        case 'foundation':
            specifications.push(
                createTableRow('Тип фундамента', details?.foundation?.type),
                createTableRow('Площадь основания, м²', details?.foundation?.area),
                createTableRow('Глубина заложения, м', details?.foundation?.depth),
            );
            break;

        case 'drainage':
            specifications.push(
                createTableRow('Тип дренажной системы', details?.drainage?.type),
                createTableRow('Общая протяженность, м', details?.drainage?.length),
                createTableRow('Глубина заложения, м', details?.drainage?.depth),
                createTableRow('Материалы труб', details?.drainage?.material),
                createTableRow('Компоненты системы', details?.drainage?.elements)
            );
            break;

        case 'earthwork':
            specifications.push(
                createTableRow('Вид земляных работ', details?.earthwork?.type),
                createTableRow('Объем грунта, м³', details?.earthwork?.volume),
                createTableRow('Глубина выемки, м', details?.earthwork?.depth),
                createTableRow('Используемая техника', details?.earthwork?.equipment),
                createTableRow('Особые условия', details?.earthwork?.comments || 'отсутствуют')
            );
            break;

        case 'farm_building':
            specifications.push(
                createTableRow('Тип сооружения', details?.farmBuilding?.type),
                createTableRow('Общая площадь, м²', details?.farmBuilding?.area),
                createTableRow('Высота сооружения, м', details?.farmBuilding?.height),
                createTableRow('Строительные материалы', details?.farmBuilding?.material),
            );
            break;

        case 'greenhouse':
            specifications.push(
                createTableRow('Тип тепличного комплекса', details?.greenhouse?.type),
                createTableRow('Площадь, м²', details?.greenhouse?.area),
                createTableRow('Система отопления', details?.greenhouse?.heating),
                createTableRow('Система полива', details?.greenhouse?.irrigation),
                createTableRow('Дополнительное оснащение', details?.greenhouse?.features)
            );
            break;

        case 'landscape':
            specifications.push(
                createTableRow('Виды работ', details?.landscape?.works),
                createTableRow('Общая площадь, м²', details?.landscape?.area),
                createTableRow('Тип покрытия', details?.landscape?.pavingType),
            );
            break;

        case 'livestock':
            specifications.push(
                createTableRow('Вид животных', details?.livestock?.type),
                createTableRow('Поголовье', details?.livestock?.animalsCount),
                createTableRow('Площадь комплекса, м²', details?.livestock?.area),
                createTableRow('Система вентиляции', details?.livestock?.ventilation ? 'требуется' : 'не требуется'),
                createTableRow('Особые требования', details?.livestock?.features)
            );
            break;

        case 'road':
            specifications.push(
                createTableRow('Тип дорожного полотна', details?.road?.type),
                createTableRow('Протяженность, м', details?.road?.length),
                createTableRow('Ширина, м', details?.road?.width),
                createTableRow('Материал покрытия', details?.road?.coating),
                createTableRow('Дополнительные требования', details?.road?.features)
            );
            break;

        case 'storage':
            specifications.push(
                createTableRow('Тип хранилища', details?.storage?.type),
                createTableRow('Вместимость, тонн', details?.storage?.capacity),
                createTableRow('Температурный режим, °C', details?.storage?.temperature),
                createTableRow('Тип вентиляции', details?.storage?.ventilation),
            );
            break;
    }

    return specifications;
}