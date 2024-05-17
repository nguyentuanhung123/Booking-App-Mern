import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import { useTranslation } from "react-i18next";

const PlacesPage = () => {

    const {t} = useTranslation();

    const [places, setPlaces] = useState([]);
    
    useEffect(() => {
        axios.get('/user-places').then(({data}) => {
            setPlaces(data);
        })
    }, []);

    const deleteUserPlace = (id) => {
        axios.delete(`/user-places/${id}`)
        .then(() => {
            window.location.reload(); // corrected to window.location.reload()
        })
        //console.log(id);
    }

    return(
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    {t('add new place')}
                </Link>
            </div>
            <div className="mt-4">
                {places.length > 0 && places.map((place) => {
                    return(
                        <div key={place._id} className="relative">
                            <Link to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                                {/* Sử dụng shrink để cho phép một mục linh hoạt thu nhỏ nếu cần: */}
                                {/* Sử dụng shrink-0 để ngăn vật phẩm linh hoạt bị co lại: */}
                                {/* Sử dụng grow để cho phép một mục linh hoạt phát triển để lấp đầy bất kỳ khoảng trống nào có sẵn: */}
                                {/* Sử dụng grow-0 để ngăn một mục linh hoạt phát triển */}
                                <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                                    {/* {place.photos.length > 0 && (
                                        <img className="object-cover" src={'http://localhost:4000/uploads/'+place.photos[0]} alt=""/>
                                    )} */}
                                    <PlaceImg place={place}/>
                                </div>
                                <div className="grow-0 shrink">
                                    <h2 className="text-xl">{place.title}</h2>
                                    <p className="text-sm mt-2 text-ellipsis line-clamp-2">{place.description}</p>
                                </div>
                            </Link>
                            <span className="cursor-pointer absolute right-2 top-2" onClick={() => deleteUserPlace(place._id)}>X</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default PlacesPage;