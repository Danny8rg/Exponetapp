create database exponetApp ;
use exponetApp ;
drop database exponetapp;

select * from appUsers;

create table appUsers (
userId int primary key auto_increment,
userName varchar (50),
userMail varchar (50),
userPassword varchar (255),
userAdress varchar (50),
userRoll varchar (50),
imgurl varchar (200)
);

insert into appUsers (userName, userMail, userPassword, userAdress) 
values ('ignacio Flores', 'ignacioF gmail.com', 'Contrasena1234', 'barrio las palmas mz21 # 22');

select * from appUsers;
delete from appUsers where userId = 1;

insert into appUsers (userName, userMail, userPassword, userAdress) 
values ('Marcelia Fuentes', 'MarcelaF gmail.com', 'Contrasena1234', 'barrio el limonar mz a1 # 14');

create table appShops (
shopId int primary key auto_increment,
shopName varchar (50),
shopAdress varchar (50),
shopTell varchar (50),
shopMail varchar (50),
shopimgurl varchar (100),
shopComments varchar (600),
shopOwner int,
foreign key (shopOwner) references appUsers (userId)
);

select * from appShops;



insert into appShops (shopName, shopAdress, shopTell, shopMail, shopimgurl, shopOwner) 
values ('freechocolate', 'cll15 crr 34 esquina armenia', '3205284133', 'frechocolateARM@gmail.com', '../../public/freeChocolate_Portada.jpg', 1);
insert into appShops (shopName, shopAdress, shopTell, shopMail, shopimgurl, shopOwner) 
values ('Garderian Books', 'cll18 crr 30 esquina armenia', '3148025156', 'GarderianBooks@gmail.com', '../../public/GarderianBooks-Portada.jpg', 2);

create table appProducts (
productId int primary key auto_increment,
productName varchar (50),
productDescription varchar (500),
productPrize int,
productStock int,
productShopOwner int,
productCategory varchar(50),
productimgurl varchar (50),
foreign key (productShopOwner) references appShops (shopId)
);

select * from appProducts;

drop table appProducts ;

-- Inserción de un producto de ejemplo para la tienda "freechocolate"
INSERT INTO appProducts (productName, productDescription, productPrize, productStock, productShopOwner, productimgurl) VALUES
('Chocolate blanco premium', 'Deliciosa barra de chocolate blanco de alta calidad', 8.99, 100, 1, '../../../public/Chocolate-blanco_Premium.png');

-- Inserción de un producto de ejemplo para la tienda "garderianBooks"
INSERT INTO appProducts (productName, productDescription, productPrize, productStock, productShopOwner, productimgurl) VALUES
('Libro de aventuras épicas', 'Una emocionante novela llena de fantasía y acción', 24.99, 50, 2, '../../public/Libro_De_Aventuras_Epicas.jpg');

-- Inserciones para la tienda "freechocolate" (ID de tienda: 1)
INSERT INTO appProducts (productName, productDescription, productPrize, productStock, productShopOwner, productimgurl) VALUES
('Chocolate con almendras', 'Barra de chocolate con almendras crujientes', 9.99, 50, 1, '../../public/Chocolate_Con_Almendras.jpg'),
('Trufas de fresa', 'Trufas exquisitas con sabor a fresa', 12.99, 30, 1, '../..public/Trufas_De_Fresa.jpg'),
('Chocolate negro intenso', 'Tableta de chocolate negro con alto contenido de cacao', 10.99, 40, 1, '../../public/Chocolate_Negro_Intenso.jpg'),
('Caja surtida de chocolates', 'Variedad de chocolates en una elegante caja', 14.99, 20, 1, '../../public/Caja_Surtida_De_Chocolates.jpg'),
('Chocolate blanco con frutas', 'Chocolate blanco con trozos de frutas tropicales', 11.99, 25, 1, '../../public/Chocolate_Blanco_Con_Frutas.jpg'),
('Tableta de chocolate amargo', 'Chocolate amargo de calidad premium', 13.99, 35, 1, '../../public/Tableta_De_Chocolate_Amargo.jpg'),
('Paquete de trufas variadas', 'Trufas de chocolate en diferentes sabores', 15.99, 28, 1, '../../public/Paquete_De_Frutas_Variadas.jpg'),
('Barra de chocolate con avellanas', 'Chocolate con avellanas tostadas', 8.99, 45, 1, '../../public/Barra_De_Chocolate_Con_Avellanas.jpg'),
('Chocolates sin azúcar', 'Deliciosos chocolates sin azúcar añadido', 16.99, 15, 1, '../../public/Chocolate_Sin_Azucar.jpg'),
('Chocolate caliente en polvo', 'Mezcla para preparar chocolate caliente', 7.99, 60, 1, '../../public/Chocolate_Caliente_En_Polvo.jpg');

-- Inserciones para la tienda "garderianBooks" (ID de tienda: 2)
INSERT INTO appProducts (productName, productDescription, productPrize, productStock, productShopOwner, productimgurl) VALUES
('Libro de ciencia ficción', 'Una emocionante historia de ciencia ficción', 19.99, 80, 2, '../../public/Libro_De_Ciencia_Ficcion.jpg'),
('Novela de misterio', 'Intriga y suspenso en cada página', 16.99, 60, 2, '../../public/Novela_De_Misterio.jpg'),
('Libro de fantasía épica', 'Mundo de fantasía con personajes fascinantes', 24.99, 50, 2, '../../public/Libro_De_Fantasia_Epica.jpg'),
('Libro de romance', 'Una historia de amor inolvidable', 18.99, 75, 2, '../../public/Libro_De_Romance.jpg'),
('Thriller psicológico', 'Intriga y giros sorprendentes', 21.99, 55, 2, '../../public/Thriller_Psicologico.jpg'),
('Libro de historia antigua', 'Exploración de civilizaciones antiguas', 23.99, 45, 2, '../../public/Libro_De_Historia_Antigua.jpg'),
('Libro de poesía contemporánea', 'Versos que expresan emociones modernas', 14.99, 65, 2, '../../public/Libro_De_Poesia_Contemporanea.jpg'),
('Libro de desarrollo personal', 'Consejos prácticos para el crecimiento personal', 17.99, 70, 2, '../../public/Libro_De_Desarrollo_Personal.jpg'),
('Libro de cocina internacional', 'Recetas de todo el mundo para experimentar en casa', 22.99, 40, 2, '../../public/Libro_De_Cocina_Internacional.jpg'),
('Novela de aventuras', 'Emocionante viaje lleno de acción y descubrimientos', 20.99, 58, 2, '../../public/Novela_De_Aventuras.jpg');


drop table appComments;

create table appComments (
commentId int primary key auto_increment,
userComment int,
foreign key (userComment) references appUsers(userId),
appComment varchar (500)
);

create table appBuyCars(
buyCarId int primary key auto_increment ,
buyCarContent varchar (10000),
buyCarState varchar (50),
buyCarOwner int,
foreign key (buyCarOwner) references appUsers (UserId)
)

insert into appComments (appComment, userComment ) values ("muy buena la app la interfaz muy intuitiva y bonita", 1)

DELIMITER //

CREATE PROCEDURE GetCommentsWithUser()
BEGIN
  SELECT appUsers.userName, appComments.appComment
  FROM appComments
  INNER JOIN appUsers ON appComments.userComment = appUsers.userId;
END //

DELIMITER ;

DELIMITER // 

CREATE PROCEDURE GetBuyCarsAndUserInfo()
BEGIN
    SELECT appBuyCars.buyCarId, buyCarContent, buyCarState
    FROM appBuyCars
    INNER JOIN appUsers ON appBuyCars.buyCarId = appUsers.UserId;
END//

DELIMITER ;



