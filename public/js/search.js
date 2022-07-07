import axios from 'axios';


export const searchFood = async (product)=>{
    try{
        const res = await axios(`/api/v1/foods/?category=${product}`)
      const model = res.data.data
        // console.log (model)
    }catch(err){
        console.log(err)
    }
}
