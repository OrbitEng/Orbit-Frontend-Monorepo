import { useEffect } from "react";

export default function onClickOutside(ref, callback){
    useEffect(() => {
        const handleClickOutside = (evt) => {
            if (ref.current && !ref.current.contains(evt.target)) {
                callback(); //Do what you want to handle in the callback
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });
};