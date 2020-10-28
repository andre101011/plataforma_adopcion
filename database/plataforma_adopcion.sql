-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 28-10-2020 a las 16:19:51
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `plataforma_adopcion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Adopcion`
--

CREATE TABLE `Adopcion` (
  `solicitud_adopcion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`solicitud_adopcion`)),
  `id_adopcion` int(11) NOT NULL,
  `id_animal` int(11) NOT NULL,
  `id_adoptante` varchar(45) NOT NULL,
  `fecha_estudio` date NOT NULL,
  `fecha_entrega` date NOT NULL,
  `estado` varchar(45) NOT NULL,
  `observaciones` varchar(200) DEFAULT NULL,
  `Empleado_cedula` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Adoptante`
--

CREATE TABLE `Adoptante` (
  `id_adoptante` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `tipo_documento` varchar(45) NOT NULL,
  `documento_identidad` varchar(45) NOT NULL,
  `tel_casa` varchar(45) DEFAULT NULL,
  `celular` varchar(45) DEFAULT NULL,
  `ciudad` varchar(45) NOT NULL,
  `ocupacion` varchar(45) DEFAULT NULL,
  `direccion` varchar(45) NOT NULL,
  `correo` varchar(45) DEFAULT NULL,
  `referencias` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`referencias`)),
  `cuestionario` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cuestionario`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Animal`
--

CREATE TABLE `Animal` (
  `id_animal` int(11) NOT NULL,
  `especie` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `edad` varchar(10) NOT NULL,
  `sexo` varchar(10) NOT NULL,
  `caracteristicas` varchar(300) DEFAULT NULL,
  `sitio_rescate` varchar(45) DEFAULT NULL,
  `fecha_rescate` date DEFAULT NULL,
  `raza` varchar(45) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `vacunas` varchar(100) NOT NULL,
  `esterilizado` tinyint(1) NOT NULL,
  `desparasitado` tinyint(1) NOT NULL,
  `tamanio` varchar(45) NOT NULL,
  `ruta_imagen` varchar(200) DEFAULT NULL,
  `custodia` varchar(30) NOT NULL,
  `estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Animal`
--

INSERT INTO `Animal` (`id_animal`, `especie`, `nombre`, `edad`, `sexo`, `caracteristicas`, `sitio_rescate`, `fecha_rescate`, `raza`, `color`, `vacunas`, `esterilizado`, `desparasitado`, `tamanio`, `ruta_imagen`, `custodia`, `estado`) VALUES
(8, 'perro', 'Neron', '6', 'macho', 'Es un perrito muy tierno, pero es un poco nervioso\r\n', 'Chaguala', '2020-10-22', 'criollo', 'cafe', 'antirrabica', 1, 1, '10', 'uploaded_images/descarga.jpeg', 'Fundamor', 'sin adoptar'),
(9, 'gato', 'Mishi', '2', 'hembra', 'Es muy jugueton', 'Barrio Guaduales', '2020-10-13', 'no aplica', 'gris', 'antirrabica', 1, 1, '30', 'uploaded_images/descarga (1).jpeg', 'Fundamor', 'sin adoptar'),
(10, 'gato', 'carey', '3', 'hembra', 'amistoso...', 'llanitos', '2020-10-14', 'no aplica', 'cafe', 'antirrabica', 1, 1, '30', 'uploaded_images/5c8ad782230000d50423cebe.jpeg', 'Fundamor', 'sin adoptar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Empleado`
--

CREATE TABLE `Empleado` (
  `cedula` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `fundacion` varchar(30) DEFAULT NULL,
  `rol` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Empleado`
--

INSERT INTO `Empleado` (`cedula`, `email`, `password`, `nombre`, `fundacion`, `rol`) VALUES
('1005095547', 'nfigueroasan@gmail.com', '$2a$10$SBAKjynfNPNFz0pPh4YUsOGuaWxBg1S9LUz0iUldyDPqQib124bT2', 'Neyder', 'fundamor', 'admin'),
('629475683', 'juan@gmail.com', '$2a$10$PagkiAaKc7bXZ95tfCDcV.rbluBujqTNAOp5U.VePxbsCfU0kwfZe', 'juan', 'fundamor', NULL),
('987654', 'marcos@gmail.com', '$2a$10$G974WyQJ3vsofauC5AaZte4lmYtfF9abeCvi/r4uUqbygY.GOrWYS', 'marcos', 'fundamor', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Seguimiento`
--

CREATE TABLE `Seguimiento` (
  `idSeguimiento` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `anotaciones` varchar(500) NOT NULL,
  `id_animal` int(11) NOT NULL,
  `id_adoptante` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Adopcion`
--
ALTER TABLE `Adopcion`
  ADD PRIMARY KEY (`id_animal`,`id_adoptante`),
  ADD UNIQUE KEY `id_adopcion` (`id_adopcion`) USING BTREE,
  ADD KEY `fk_Adopcion_Animal` (`id_animal`) USING BTREE,
  ADD KEY `fk_Adopcion_Adoptante` (`id_adoptante`) USING BTREE,
  ADD KEY `fk_Adopcion_Empleado` (`Empleado_cedula`) USING BTREE;

--
-- Indices de la tabla `Adoptante`
--
ALTER TABLE `Adoptante`
  ADD PRIMARY KEY (`id_adoptante`),
  ADD UNIQUE KEY `idadoptante_UNIQUE` (`id_adoptante`),
  ADD UNIQUE KEY `documento_identidad` (`documento_identidad`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `Animal`
--
ALTER TABLE `Animal`
  ADD PRIMARY KEY (`id_animal`),
  ADD UNIQUE KEY `idAnimal` (`id_animal`),
  ADD UNIQUE KEY `ruta_imagen` (`ruta_imagen`);

--
-- Indices de la tabla `Empleado`
--
ALTER TABLE `Empleado`
  ADD PRIMARY KEY (`cedula`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `Seguimiento`
--
ALTER TABLE `Seguimiento`
  ADD PRIMARY KEY (`id_animal`,`id_adoptante`),
  ADD KEY `fk_Seguimiento_Adopcion` (`id_animal`,`id_adoptante`) USING BTREE;

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Adopcion`
--
ALTER TABLE `Adopcion`
  MODIFY `id_adopcion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Animal`
--
ALTER TABLE `Animal`
  MODIFY `id_animal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Adopcion`
--
ALTER TABLE `Adopcion`
  ADD CONSTRAINT `fk_Adopcion_Adoptante` FOREIGN KEY (`id_adoptante`) REFERENCES `Adoptante` (`id_adoptante`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Adopcion_Animal` FOREIGN KEY (`id_animal`) REFERENCES `Animal` (`id_animal`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Adopcion_Empleado` FOREIGN KEY (`Empleado_cedula`) REFERENCES `Empleado` (`cedula`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `Seguimiento`
--
ALTER TABLE `Seguimiento`
  ADD CONSTRAINT `fk_Seguimiento_Adopcion` FOREIGN KEY (`id_animal`,`id_adoptante`) REFERENCES `Adopcion` (`id_animal`, `id_adoptante`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
