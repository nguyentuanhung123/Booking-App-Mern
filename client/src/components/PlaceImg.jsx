/* eslint-disable react/prop-types */
const PlaceImg = ({place, index=0, className}) => {

    if(!place.photos?.length){
        return '';
    }

    if(!className){
        className = 'object-cover w-full'
    }

    return(
        <img className={className} src={'http://localhost:4000/uploads/'+place.photos[index]} alt=""/>
    )
}
export default PlaceImg;