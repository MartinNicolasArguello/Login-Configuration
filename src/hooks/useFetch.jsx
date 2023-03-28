import react, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = "http://localhost:3030/members/";


export default function useFetch(url) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        axios.get(url).then((res) => {
            setData(res.data);
        }).catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false)
        });
    }, [url]);




    return { data, loading, error };


}


// export default function useFetch() {

//     const [data, setData] = useState([])


//     const getData = async () => {
//         try {
//             const res = await fetch(BASE_URL);
//             const json = await res.json();
//             console.log(res)
//             // setData(json)
//         }
//         catch (error) {
//             console.log(error)

//         };
//     };

//     getData()
//     // useEffect(() => {
//     //     getData()
//     // }, [])
//     return data;
// }