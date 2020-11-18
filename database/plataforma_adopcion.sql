-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 18-11-2020 a las 19:56:47
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
  `id_adopcion` int(11) NOT NULL,
  `id_animal` int(11) NOT NULL,
  `id_adoptante` varchar(45) NOT NULL,
  `fecha_estudio` date NOT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `estado` varchar(45) NOT NULL,
  `observaciones` varchar(200) DEFAULT NULL,
  `Empleado_cedula` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Adoptante`
--

CREATE TABLE `Adoptante` (
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
  `color` varchar(45) NOT NULL,
  `vacunas` varchar(100) NOT NULL,
  `esterilizado` tinyint(1) NOT NULL,
  `desparasitado` tinyint(1) NOT NULL,
  `tamanio` varchar(45) NOT NULL,
  `ruta_imagen` varchar(200) DEFAULT NULL,
  `custodia` varchar(30) NOT NULL,
  `estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
('1005095547', 'nfigueroasan@gmail.com', '$2a$10$ETDhPsfxwkZcq0T1p5ZWU.XUrx.zYcXDW4Eub1d.WuryrF29agAry', 'nfs', 'fundamor', 'admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Seguimiento`
--

CREATE TABLE `Seguimiento` (
  `id_seguimiento` int(11) NOT NULL,
  `fecha_hora` date NOT NULL,
  `anotaciones` varchar(500) NOT NULL,
  `id_animal` int(11) NOT NULL,
  `id_adoptante` varchar(45) NOT NULL,
  `id_adopcion` int(11) NOT NULL
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
  ADD KEY `fk_Adopcion_Empleado` (`Empleado_cedula`) USING BTREE,
  ADD KEY `fk_Adopcion_Adoptante` (`id_adoptante`);

--
-- Indices de la tabla `Adoptante`
--
ALTER TABLE `Adoptante`
  ADD PRIMARY KEY (`documento_identidad`) USING BTREE,
  ADD UNIQUE KEY `documento_identidad` (`documento_identidad`) USING BTREE,
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
  ADD PRIMARY KEY (`id_seguimiento`) USING BTREE,
  ADD UNIQUE KEY `id_seguimiento` (`id_seguimiento`),
  ADD KEY `Seguimiento_ibfk_1` (`id_adopcion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Adopcion`
--
ALTER TABLE `Adopcion`
  MODIFY `id_adopcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `Animal`
--
ALTER TABLE `Animal`
  MODIFY `id_animal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `Seguimiento`
--
ALTER TABLE `Seguimiento`
  MODIFY `id_seguimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Adopcion`
--
ALTER TABLE `Adopcion`
  ADD CONSTRAINT `fk_Adopcion_Adoptante` FOREIGN KEY (`id_adoptante`) REFERENCES `Adoptante` (`documento_identidad`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Adopcion_Animal` FOREIGN KEY (`id_animal`) REFERENCES `Animal` (`id_animal`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Adopcion_Empleado` FOREIGN KEY (`Empleado_cedula`) REFERENCES `Empleado` (`cedula`) ON DELETE SET NULL;

--
-- Filtros para la tabla `Seguimiento`
--
ALTER TABLE `Seguimiento`
  ADD CONSTRAINT `Seguimiento_ibfk_1` FOREIGN KEY (`id_adopcion`) REFERENCES `Adopcion` (`id_adopcion`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
