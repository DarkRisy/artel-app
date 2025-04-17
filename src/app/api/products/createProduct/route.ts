'use server'
import { NextResponse } from 'next/server';
import fs from 'fs/promises'; // Используем промисы для работы с файловой системой
import path from 'path';
import { UserProduct } from '../../db';

// Функция для создания продукта в базе данных
async function createProduct(productName: string, productPrice: number, fileName: string) {
  await UserProduct.create({
    Name: productName,
    Price: productPrice,
    Image: fileName, // Использование имени файла из формы
  });
}

// Функция для получения уникального имени файла
const getUniqueFileName = async (originalFileName: string): Promise<string> => {
  // Удаляем пробелы из оригинального имени файла
  const sanitizedFileName = originalFileName.replace(/\s+/g, '_'); // Заменяем пробелы на подчеркивания
  
  const extname = path.extname(sanitizedFileName);
  const baseName = path.basename(sanitizedFileName, extname);
  let uniqueFileName = sanitizedFileName; // Используем обработанное имя файла
  let counter = 1;

  // Проверка на существование файла и генерация уникального имени, если необходимо
  while (await fileExists(path.join(process.cwd(), 'public/images', uniqueFileName))) {
    uniqueFileName = `${baseName}(${counter})${extname}`; // Создаем новое имя
    counter++;
  }

  return uniqueFileName;
};

// Функция для проверки существования файла
const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true; // Файл существует
  } catch (error) {
    return false; // Файл не существует
  }
};

// Обработчик маршрута
export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json(
      { message: 'Content-Type must be multipart/form-data' },
      { status: 415 }
    );
  }

  const formData = await request.formData(); // Получаем данные формы
  const file = formData.get('image') as File; // Получаем файл из формы
  const productName = formData.get('name') as string; // Получаем имя продукта
  const productPrice = parseInt(formData.get('price') as string); // Получаем цену продукта

  if (!file || !productName || isNaN(productPrice)) {
    return NextResponse.json(
      { message: 'Invalid input data' },
      { status: 400 }
    );
  }

  try {
    const buffer = await file.arrayBuffer(); // Получаем массив байтов файла
    const originalFileName = file.name; // Получаем оригинальное имя файла
    const uniqueFileName = await getUniqueFileName(originalFileName); // Получаем уникальное имя файла

    const filePath = path.resolve(process.cwd(), "public/images", uniqueFileName);

    await fs.writeFile(filePath, Buffer.from(buffer)); // Асинхронная запись файла
    await createProduct(productName, productPrice, uniqueFileName); // Создание продукта с уникальным именем файла

    return NextResponse.json({ Name: productName, Image: uniqueFileName, Price: productPrice });
  } catch (error) {
    console.error("Error during file upload:", error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}