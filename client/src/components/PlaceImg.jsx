const PlaceImg = ({place, index=0}) => {

    if(!place.photos?.length){
        return '';
    }

    return(
        <img className="object-cover" src={'http://localhost:4000/uploads/'+place.photos[0]} alt=""/>
    )
}
export default PlaceImg;