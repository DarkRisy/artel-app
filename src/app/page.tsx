'use client'
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Zoom from 'ol/control/Zoom';
import ScaleLine from 'ol/control/ScaleLine';
import FullScreen from 'ol/control/FullScreen';
import 'ol/ol.css';

// Конфигурация
const CONFIG = {
  map: {
    center: [55.153576, 51.801449] as [number, number],
    zoom: 16,
    minZoom: 12,
    maxZoom: 19
  },
  contacts: {
    name: "Артель",
    address: "г. Оренбург, ул. Монтажников, 21, 2 этаж",
    hours: "Пн-Пт 9:00-18:00",
    phone: "+7 (3532) 12-34-56",
    email: "info@artel-orenburg.ru"
  },
  activities: [
    {
      title: "Земельные работы",
      image: "/images/earthwork.svg",
      description: "Полный комплекс работ по подготовке и планировке земельных участков"
    },
    {
      title: "Дренажные работы",
      image: "/images/drainage.svg",
      description: "Устройство систем водоотведения и дренажа любой сложности"
    },
    {
      title: "Фундаментные работы",
      image: "/images/foundation.svg",
      description: "Возведение всех типов фундаментов для различных сооружений"
    },
    {
      title: "Дорожные работы",
      image: "/images/road.svg",
      description: "Строительство и ремонт дорог, подъездных путей и площадок"
    },
    {
      title: "Строительство хранилищ",
      image: "/images/storage.svg",
      description: "Возведение современных хранилищ для сельхозпродукции"
    },
    {
      title: "Животноводческие комплексы",
      image: "/images/livestock.svg",
      description: "Строительство ферм и комплексов для содержания животных"
    },
    {
      title: "Тепличные комплексы",
      image: "/images/greenhouse.svg",
      description: "Проектирование и строительство теплиц промышленного масштаба"
    },
    {
      title: "Здания сельхозназначения",
      image: "/images/farm_building.svg",
      description: "Строительство специализированных зданий для сельского хозяйства"
    },
    {
      title: "Благоустройство территорий",
      image: "/images/landscape.svg",
      description: "Озеленение, мощение, установка малых архитектурных форм"
    }
  ]
};

// Компонент карточки деятельности
function ActivityCard({ activity }: { activity: typeof CONFIG.activities[0] }) {
  return (
    <div className="group relative h-64 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      <div className="relative h-full w-full">
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white mb-2">{activity.title}</h3>
        <p className="text-gray-200 text-sm">{activity.description}</p>
      </div>
    </div>
  );
}

// Компонент контактной карточки
function ContactCard({ 
  icon, 
  title, 
  children 
}: { 
  icon: React.ReactNode, 
  title: string, 
  children: React.ReactNode 
}) {
  return (
    <div className="bg-[#3C4447] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold text-[#C34D3F] mb-3 flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {icon}
        </svg>
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

// Основной компонент
export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef<Map | null>(null);

  const initMap = useCallback(() => {
    if (!mapRef.current || !popupRef.current || mapInstance.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: [
              '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
            ]
          })
        })
      ],
      view: new View({
        center: fromLonLat(CONFIG.map.center),
        zoom: CONFIG.map.zoom,
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom
      }),
      controls: [
        new Zoom({
          className: 'custom-zoom bg-white rounded shadow',
          zoomInLabel: '+',
          zoomOutLabel: '-'
        }),
        new ScaleLine({
          units: 'metric',
          bar: true,
          minWidth: 100
        }),
      ]
    });

    // Маркер и попап
    const marker = new Feature({
      geometry: new Point(fromLonLat(CONFIG.map.center)),
      ...CONFIG.contacts
    });

    marker.setStyle(new Style({
      image: new Icon({
        src: '/images/marker.png',
        anchor: [0.5, 1],
        scale: 1
      })
    }));

    const vectorLayer = new VectorLayer({
      source: new VectorSource({ features: [marker] })
    });

    map.addLayer(vectorLayer);

    const popup = new Overlay({
      element: popupRef.current!,
      positioning: 'bottom-center',
      offset: [0, -40]
    });

    map.addOverlay(popup);

    // Обработчики событий
    const showPopup = (coordinate: number[], content: string) => {
      popupRef.current!.innerHTML = content;
      popup.setPosition(coordinate);
      popupRef.current!.classList.remove('hidden');
    };

    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const props = feature.getProperties();
        showPopup(evt.coordinate, `
          <div class="p-3">
            <h4 class="text-lg font-bold text-[#C34D3F]">${props.name}</h4>
            <p class="text-sm text-gray-600">${props.address}</p>
            <p class="text-sm mt-1"><strong>Часы работы:</strong> ${props.hours}</p>
            <a href="tel:${props.phone.replace(/\s/g, '')}" 
               class="mt-2 inline-flex items-center text-[#C34D3F] text-sm hover:underline">
              ${props.phone}
            </a>
          </div>
        `);
      }
    });

    map.once('postrender', () => setMapLoaded(true));

    const resizeObserver = new ResizeObserver(() => map.updateSize());
    resizeObserver.observe(mapRef.current);

    return () => {
      resizeObserver.disconnect();
      map.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    return initMap();
  }, [initMap]);

  return (
    <div className="">

      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image src="/images/home_block.svg" alt="Строительная компания Артель" fill className="object-cover" priority/>
          <div className="absolute inset-0" />
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {CONFIG.contacts.name}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Профессиональные строительные решения
          </p>
        </div>
      </section>
      <div className="w-full h-2 bg-[#C34D3F]"></div>

      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Направления деятельности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONFIG.activities.map((activity, i) => (
              <ActivityCard key={i} activity={activity} />
            ))}
          </div>
        </div>
      </section>
      <div className="w-full h-2 bg-[#C34D3F]"></div>
      {/* Contacts Section */}
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Контакты
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 space-y-6">
              <ContactCard 
                icon={
                  <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                }
                title="Адрес"
              >
                <p>{CONFIG.contacts.address}</p>
              </ContactCard>
              <ContactCard 
                icon={
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                }
                title="Контакты"
              >
                <a href={`tel:${CONFIG.contacts.phone.replace(/\s/g, '')}`} 
                   className="hover:text-[#C34D3F] transition-colors">
                  {CONFIG.contacts.phone}
                </a>
                <a href={`mailto:${CONFIG.contacts.email}`} 
                   className="hover:text-[#C34D3F] transition-colors block">
                  {CONFIG.contacts.email}
                </a>
              </ContactCard>

              <ContactCard 
                icon={ <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />} title="Часы работы">
                <p>{CONFIG.contacts.hours}</p>
                <p>Суббота - Воскресенье: выходной</p>
              </ContactCard>
            </div>
            <div className="lg:w-1/2 h-[448px] rounded-xl overflow-hidden shadow-lg relative">
              <div 
                ref={mapRef} 
                className={`w-full h-full ${mapLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
              />
              {!mapLoaded && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="animate-pulse">Загрузка карты...</div>
                </div>
              )}
              <div 
                ref={popupRef}
                className="hidden absolute bg-white p-3 rounded shadow-lg max-w-xs z-10"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}