import Image from "next/image";

function Home() {
  return (
    <>
      <div className="w-full h-full">
        <div className="flex justify-between" >
          <div className="ml-[22px] text-white">
            <h1 className=" mt-[126px]  text-[64px] font-bold">Артель</h1>
            <p className="">Строительная компания</p>
          </div>
          <Image className="w-fit h-full object-contain" src='./images/home_block.svg' width={0} height={0}  alt="" />
        </div>
        <div className=" w-[100%] h-[6px] bg-[#C34D3F]"></div>
      </div>

    </>
  )
}
export default Home