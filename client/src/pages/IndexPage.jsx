import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import ReactPaginate from 'react-paginate';

const IndexPage = () => {

    const [places, setPlaces] = useState([]);

    const [searchText, setSearchText] = useState('');

    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        axios.get('/places').then((response) => {
            setPlaces(response.data);
            //setPlaces([...response.data, ...response.data, ...response.data, ...response.data]);
        })
    },[])

     // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(places.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(places.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, places])

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % places.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    // Filter places based on search text
    const filteredPlaces = currentItems.filter(place =>
        place.address.toLowerCase().includes(searchText.toLowerCase()) ||
        place.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return(
        <>
            <Search handleSearchPlace = {setSearchText}/>
            <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {
                    filteredPlaces.length > 0 && filteredPlaces.map((place) => {
                        return(
                                <Link to={'/place/' + place._id} key={place._id}>
                                    <div className="bg-gray-500 mb-2 rounded-2xl flex">
                                        {
                                            place.photos?.[0] && (
                                                // Sử dụng tiện ích aspect-{ratio} để đặt tỷ lệ khung hình mong muốn của một phần tử.
                                                // square : để image là hình vuông
                                                <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/'+place.photos?.[0]} alt=""/>
                                            )
                                        }
                                    </div>
                                    <h2 className="font-bold">Hosted by {place.owner.name}</h2>
                                    <h2 className="font-semibold">{place.address}</h2>
                                    <h3 className="text-sm text-gray-500">{place.title}</h3>
                                    <div className="mt-1">
                                        <span className="font-bold">${place.price}</span> per night
                                    </div>
                                </Link>
                        )
                    })
                }
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName='pagination'
                pageLinkClassName='page-num'
                previousLinkClassName='page-num'
                nextLinkClassName='page-num'
                activeLinkClassName='active'
            />
        </>
    )
}
export default IndexPage;