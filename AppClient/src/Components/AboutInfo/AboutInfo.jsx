import React from 'react';
import './AboutInfo.css'; // Archivo de estilos CSS

const InfoSection = () => {
    return (
        <section className="about-info-container" id='about-info'>
            <div className="box-title-about">
                <h2 className='about-title'>¿Qué es ExpoNet?</h2>
            </div>
            <section className='box-info-container'>
                <div className="info-content shadow-sm">
                    <p>Tu plaza virtual para descubrir y apoyar a las microempresas y emprendimientos locales de tu ciudad. Explora una amplia variedad de productos únicos y apoya a tu comunidad con cada compra. Crea tu perfil para descubrir nuevas tiendas y productos, y disfruta de una experiencia de compra sencilla y gratificante mientras celebras lo mejor de tu ciudad en un solo lugar. ¡Únete a nosotros y forma parte del movimiento del comercio local en ExpoNet!</p>
                </div>
                <div className="info-image shadow-sm">
                    <img src="https://www.davidlombana.com/wp-content/uploads/2022/08/eCommerce-tienda-online.png" alt="Imagen ilustrativa" />
                </div>
            </section>
        </section>
    );
}

export default InfoSection;