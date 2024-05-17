import { useTranslation } from "react-i18next";

/* eslint-disable react/prop-types */
const Languageoption = (props) => {

    const {t} = useTranslation();

    return (
        <div className="flex items-center justify-center mt-10">
            <select onChange={props.onChange}>
                <option>{t('select language')}</option>
                <option value={'en'}>{t('english')}</option>
                <option value={'vn'}>{t('vietnam')}</option>
            </select>
        </div>
    )
}

export default Languageoption;