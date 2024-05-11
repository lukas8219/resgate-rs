import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';

type PeoplePopupProps = {
    handleSubmit: (data: any) => void,
    data: google.maps.LatLngLiteral | undefined,
    isVisible: boolean,
    closePopup: () => void;
}

export function PeoplePopup({ handleSubmit, data, isVisible, closePopup  }: PeoplePopupProps) {
    const formik = useFormik({
        initialValues: {
            name: '',
            type: 'homem',
            situation: 'esperando resgate',
            extraInfo: ''
        },
        onSubmit: values => {
            formik.resetForm({ values: { name: '', type: 'homem', extraInfo: '', situation: 'esperando resgate'}});
            handleSubmit({
                location: data,
                ...values,
            });
        },
    })
    return (
            <div className={`z-[9999] ${!isVisible ? 'hidden' : ''} fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nome
                    </label>
                    <input name='name' value={formik.values.name} onChange={formik.handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="npme" type="text" placeholder="Nome"/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tipo de Regaste
                    </label>
                    <select name='type' value={formik.values.type} onChange={formik.handleChange} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value='homem'>Homem</option>
                        <option value='mulher'>Mulher</option>
                        <option value='crianca'>Criança</option>
                        <option value='animal'>Animal</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Informação Adicional
                    </label>
                    <input name='extraInfo' value={formik.values.extraInfo} onChange={formik.handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="npme" type="text" placeholder="Nome"/>
                </div>
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                        Situação
                    </label>
                    <select name='situation' value={formik.values.situation} onChange={formik.handleChange} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value='esperando resgate'>Esperando Resgate</option>
                        <option value='esperando resgate - grave'>Esperando Resgate - Grave</option>
                        <option value='resgatado'>Resgatado</option>
                    </select>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Enviar
                </button>
                <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={closePopup}>
                    Fechar
                </button>
            </form>
        </div>
    )
}