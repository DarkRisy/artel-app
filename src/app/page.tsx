// import Image from "next/image";

// function Home() {
//   return (
//     <>
//       <div className="w-full h-full">
//         <div className="flex justify-between" >
//           <div className="ml-[22px] text-white">
//             <h1 className=" mt-[126px]  text-[64px] font-bold">Артель</h1>
//             <p className="">Строительная компания</p>
//           </div>
//           <Image className="w-fit h-full object-contain" src='./images/home_block.svg' width={0} height={0}  alt="" />
//         </div>
//         <div className=" w-[100%] h-[6px] bg-[#C34D3F]"></div>
//       </div>

//     </>
//   )
// }
// export default Home
import Image from "next/image";

function Home() {
  return (
    <>
      <div className="w-full h-screen flex">
        <div className="flex flex-col justify-center items-center text-white p-4 md:p-12 lg:p-24 w-full md:w-1/2">
          <h1 className="text-5xl md:text-7xl font-bold mb-2 transition-transform duration-300 ease-in-out transform hover:scale-105">
            Артель
          </h1>
          <p className="text-lg md:text-xl opacity-80">
            Строительная компания
          </p>
        </div>
        <div className="w-full md:w-1/2 h-full relative">
          <Image
            className="object-cover w-full h-full"
            src='./images/home_block.svg'
            alt="Изображение, представляющее компанию Артель"
            layout="fill"
          />
        </div>
      </div>
      <div className="w-full h-[6px] bg-[#C34D3F]"></div>
    </>
  );
}

export default Home;
