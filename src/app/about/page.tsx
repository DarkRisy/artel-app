import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="relative mt-28 bg-[#2D3538] text-white py-16 px-6">
      <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/image.jpg)' }} />
      <div className="relative max-w-7xl mx-auto text-center z-10">
        <h2 className="text-4xl font-bold mb-8">О компании Артель</h2>
        <p className="text-lg mb-8 leading-relaxed">
          Мы — компания с безупречной репутацией, создающая уникальные пространства, 
          которые сочетают стиль, комфорт и высокое качество. Наша цель — воплотить в жизнь 
          ваши мечты о идеальном доме и функциональном коммерческом пространстве.
        </p>
        
        <h3 className="text-2xl font-semibold mb-6">Наши Принципы</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-[#C34D3F] p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <h4 className="text-xl font-bold mb-4">Качество</h4>
            <p>
              Мы используем только лучшие материалы и современные технологии, что гарантирует 
              долговечность и надежность ваших проектов.
            </p>
          </div>
          <div className="bg-[#C34D3F] p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <h4 className="text-xl font-bold mb-4">Профессионализм</h4>
            <p>
              Наша команда состоит из высококвалифицированных специалистов, которые предлагают 
              индивидуальный подход к каждому проекту.
            </p>
          </div>
          <div className="bg-[#C34D3F] p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <h4 className="text-xl font-bold mb-4">Соблюдение сроков</h4>
            <p>
              Мы ценим ваше время и гарантируем выполнение работ в строго согласованные сроки.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-6">Почему выбирают нас</h3>
        <p className="text-lg mb-4 leading-relaxed">
          Мы создаем не просто здания, а уютные пространства, в которых начинается новая жизнь. 
          Слушая наших клиентов, мы разрабатываем решения, которые отвечают их желаниям и потребностям.
        </p>
        <p className="text-lg mb-8 leading-relaxed">
          Наша цель — построить долгосрочные отношения, основанные на доверии и уважении к 
          каждому клиенту.
        </p>

        <div className="mt-8">
          <p className="text-lg mb-4">
            Готовы сделать шаг к своему идеальному пространству?
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;