import Image from "next/image";

function Home() {
  return (
    <>
      <div className="w-full h-screen flex flex-col">
        <div className="relative w-full h-full">
          <Image
            className="object-cover w-full h-full"
            src='./images/home_block.svg'
            alt="Изображение, представляющее компанию Артель"
            layout="fill"
          />
        </div>
        <div className="flex flex-col justify-center items-center text-white p-4 md:p-12 lg:p-24 absolute inset-0 z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-2 transition-transform duration-300 ease-in-out transform hover:scale-105">
            Артель
          </h1>
          <p className="text-lg md:text-xl opacity-80">
            Строительная компания
          </p>
        </div>
      </div>
      <div className="w-full h-[6px] bg-[#C34D3F]"></div>
    </>
  );
}

export default Home;