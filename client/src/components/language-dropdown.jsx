/* eslint-disable react/prop-types */
const Languageoption = (props) => {
    return (
        <div className="flex items-center justify-center mt-10">
            <select onChange={props.onChange}>
                <option>Select Language</option>
                <option value={'en'}>English</option>
                <option value={'vn'}>VietNam</option>
            </select>
        </div>
    )
}

export default Languageoption;