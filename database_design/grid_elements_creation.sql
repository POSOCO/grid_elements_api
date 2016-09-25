-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
SET default_storage_engine=InnoDB;

-- -----------------------------------------------------
-- Schema wrldc_grid_elements
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema wrldc_grid_elements
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `wrldc_grid_elements` DEFAULT CHARACTER SET utf8 ;
USE `wrldc_grid_elements` ;

-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`states`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`states` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC));


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`regions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`regions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC));


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`owners`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`owners` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `metadata` VARCHAR(300) NULL,
  `regions_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  INDEX `fk_owners_regions_idx` (`regions_id` ASC),
  CONSTRAINT `fk_owners_regions`
  FOREIGN KEY (`regions_id`)
  REFERENCES `wrldc_grid_elements`.`regions` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`element_types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`element_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`type` ASC));


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`voltages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`voltages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `level` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`level` ASC));


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`elements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`elements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `description` VARCHAR(300) NULL,
  `sil` INT NULL,
  `stability_limit` INT NULL,
  `thermal_limit` INT NULL,
  `element_types_id` INT NOT NULL,
  `voltages_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_elements_element_types1_idx` (`element_types_id` ASC),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC, `element_types_id` ASC, `voltages_id` ASC),
  INDEX `fk_elements_voltages1_idx` (`voltages_id` ASC),
  CONSTRAINT `fk_elements_element_types1`
  FOREIGN KEY (`element_types_id`)
  REFERENCES `wrldc_grid_elements`.`element_types` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_elements_voltages1`
  FOREIGN KEY (`voltages_id`)
  REFERENCES `wrldc_grid_elements`.`voltages` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`substations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`substations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `elements_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_substations_elements1_idx` (`elements_id` ASC),
  UNIQUE INDEX `elements_id_UNIQUE` (`elements_id` ASC),
  CONSTRAINT `fk_substations_elements1`
  FOREIGN KEY (`elements_id`)
  REFERENCES `wrldc_grid_elements`.`elements` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`elements_has_substations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`elements_has_substations` (
  `elements_id` INT NOT NULL,
  `substations_id` INT NOT NULL,
  PRIMARY KEY (`elements_id`, `substations_id`),
  INDEX `fk_elements_has_elements_elements1_idx` (`elements_id` ASC),
  INDEX `fk_elements_has_substations_substations1_idx` (`substations_id` ASC),
  CONSTRAINT `fk_elements_has_elements_elements1`
  FOREIGN KEY (`elements_id`)
  REFERENCES `wrldc_grid_elements`.`elements` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_elements_has_substations_substations1`
  FOREIGN KEY (`substations_id`)
  REFERENCES `wrldc_grid_elements`.`substations` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`elements_has_owners`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`elements_has_owners` (
  `elements_id` INT NOT NULL,
  `owners_id` INT NOT NULL COMMENT 'check if this table is required can be kept in elements table itself',
  PRIMARY KEY (`elements_id`, `owners_id`),
  INDEX `fk_elements_has_owners_owners1_idx` (`owners_id` ASC),
  INDEX `fk_elements_has_owners_elements1_idx` (`elements_id` ASC),
  CONSTRAINT `fk_elements_has_owners_elements1`
  FOREIGN KEY (`elements_id`)
  REFERENCES `wrldc_grid_elements`.`elements` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_elements_has_owners_owners1`
  FOREIGN KEY (`owners_id`)
  REFERENCES `wrldc_grid_elements`.`owners` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`elements_has_states`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`elements_has_states` (
  `elements_id` INT NOT NULL,
  `states_id` INT NOT NULL,
  PRIMARY KEY (`elements_id`, `states_id`),
  INDEX `fk_elements_has_states_states1_idx` (`states_id` ASC),
  INDEX `fk_elements_has_states_elements1_idx` (`elements_id` ASC),
  CONSTRAINT `fk_elements_has_states_elements1`
  FOREIGN KEY (`elements_id`)
  REFERENCES `wrldc_grid_elements`.`elements` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_elements_has_states_states1`
  FOREIGN KEY (`states_id`)
  REFERENCES `wrldc_grid_elements`.`states` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`elements_has_regions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`elements_has_regions` (
  `elements_id` INT NOT NULL,
  `regions_id` INT NOT NULL,
  PRIMARY KEY (`elements_id`, `regions_id`),
  INDEX `fk_elements_has_regions_regions1_idx` (`regions_id` ASC),
  INDEX `fk_elements_has_regions_elements1_idx` (`elements_id` ASC),
  CONSTRAINT `fk_elements_has_regions_elements1`
  FOREIGN KEY (`elements_id`)
  REFERENCES `wrldc_grid_elements`.`elements` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_elements_has_regions_regions1`
  FOREIGN KEY (`regions_id`)
  REFERENCES `wrldc_grid_elements`.`regions` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`conductor_types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`conductor_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC));


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`lines`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`lines` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'element id and line number are unique',
  `elements_id` INT NOT NULL,
  `conductor_types_id` INT NOT NULL,
  `number` INT NULL COMMENT 'unique (element_id, number)',
  `line_length` INT NULL,
  `noloadmvar` VARCHAR(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_lines_conductor_types1_idx` (`conductor_types_id` ASC),
  INDEX `fk_lines_elements1_idx` (`elements_id` ASC),
  UNIQUE INDEX `number_UNIQUE` (`elements_id` ASC, `number` ASC),
  CONSTRAINT `fk_lines_conductor_types1`
  FOREIGN KEY (`conductor_types_id`)
  REFERENCES `wrldc_grid_elements`.`conductor_types` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_lines_elements1`
  FOREIGN KEY (`elements_id`)
  REFERENCES `wrldc_grid_elements`.`elements` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`line_reactors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`line_reactors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `elements_id` INT NOT NULL,
  `lines_id` INT NOT NULL,
  `mvar` INT NULL,
  `is_switchable` VARCHAR(1) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_line_reactors_elements1_idx` (`elements_id` ASC),
  INDEX `fk_line_reactors_lines1_idx` (`lines_id` ASC),
  CONSTRAINT `fk_line_reactors_elements1`
  FOREIGN KEY (`elements_id`)
  REFERENCES `wrldc_grid_elements`.`elements` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_line_reactors_lines1`
  FOREIGN KEY (`lines_id`)
  REFERENCES `wrldc_grid_elements`.`lines` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wrldc_grid_elements`.`bus_reactors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wrldc_grid_elements`.`bus_reactors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mvar` INT NOT NULL DEFAULT 0,
  `elements_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_bus_reactors_elements1_idx` (`elements_id` ASC),
  CONSTRAINT `fk_bus_reactors_elements1`
  FOREIGN KEY (`elements_id`)
  REFERENCES `wrldc_grid_elements`.`elements` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
  ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
