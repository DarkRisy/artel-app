import { UserProduct } from "./db";
export const seedProducts = async () => {
const productsData = [
  {
    Name: "Фундаментные работы",
    CategoryId: "foundation",
    Price: 1000,
    Image: "foundation.svg"
  },
  {
    Name: "Дренажные работы",
    CategoryId: "drainage",
    Price: 750,
    Image: "drainage.svg"
  },
  {
    Name: "Земляные работы",
    CategoryId: "earthwork",
    Price: 2500,
    Image: "earthwork.svg"
  },
  {
    Name: "Сельскохозяйственные здания",
    CategoryId: "farm_building",
    Price: 5000,
    Image: "farm_building.svg"
  },
  {
    Name: "Тепличные комплексы",
    CategoryId: "greenhouse",
    Price: 3000,
    Image: "greenhouse.svg"
  },
  {
    Name: "Благоустройство территории",
    CategoryId: "landscape",
    Price: 1200,
    Image: "landscape.svg"
  },
  {
    Name: "Животноводческие комплексы",
    CategoryId: "livestock",
    Price: 450,
    Image: "livestock.svg"
  },
  {
    Name: "Дорожные работы",
    CategoryId: "road",
    Price: 3800,
    Image: "road.svg"
  },
  {
    Name: "Хранилища",
    CategoryId: "storage",
    Price: 1800,
    Image: "storage.svg"
  },
];


try {

    await Promise.all(
      productsData.map(product => 
        UserProduct.findOrCreate({
          where: { Name: product.Name }, 
          defaults: product        
        })
      )
    );
    
    console.log('Products seeding completed successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error; 
  }
};

// seedProducts();