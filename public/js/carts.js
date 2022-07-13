import axios from 'axios';


export const getCartItem = async (id)=>{
    try{
        const res = await axios(`/api/v1/foods/${id}`)
      const model = res.data.data
      return model
        // console.log (model)
    }catch(err){
        console.log(err)
        throw(err)
    }
}