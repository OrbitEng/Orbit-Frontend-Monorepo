import { useContext } from "react";
import CartCtx from '@contexts/CartCtx';

export function CartFunctionalities(props){
    const {setCart} = useContext(CartCtx);

    const AddItem = (item) => {
        setCart(currcart => ({
            items: [...currcart.items, item]
        }))
    }

    const DeleteItem = (index) => {
        setCart(currcart => ({
            items:[...currcart.items.slice(0,index), ...currcart.items.slice(index+1)]
        }))
    };

    return {
        AddItem,
        DeleteItem
    }

}