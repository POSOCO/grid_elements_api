--
-- Dumping data for table `regions`
--

INSERT INTO `regions` (`id`, `name`) VALUES
  (1, 'WR'),
  (2, 'ER'),
  (3, 'SR'),
  (4, 'NR'),
  (5, 'NER');

--
-- Dumping data for table `owners`
--

INSERT INTO `owners` (`id`, `name`, `metadata`, `regions_id`) VALUES
  (1, 'ACPL', 'not yet', 1),
  (2, 'BALCO', 'not yet', 1),
  (3, 'ATIL', 'not yet', 1),
  (4, 'ACBIL', 'not yet', 1),
  (5, 'APL', 'not yet', 1),
  (6, 'APML', 'not yet', 1),
  (7, 'BDTCL', 'not yet', 1),
  (8, 'CGPL', 'not yet', 1),
  (9, 'CSEPTCL', 'not yet', 1),
  (10, 'CSPTCL', 'not yet', 1),
  (11, 'DB-Power', 'not yet', 1),
  (12, 'DD', 'not yet', 1),
  (13, 'DGEN', 'not yet', 1),
  (14, 'Dhariwal Infra', 'not yet', 1),
  (15, 'DIL', 'not yet', 1),
  (16, 'DNH', 'not yet', 1),
  (17, 'Electricity Dep of DD', 'not yet', 1),
  (18, 'Electricity Dep of DNH', 'not yet', 1),
  (19, 'EPTCL', 'not yet', 1),
  (20, 'ERTS-1', 'not yet', 1),
  (21, 'ERTS-2', 'not yet', 1),
  (22, 'Essar', 'not yet', 1),
  (23, 'GETCO', 'not yet', 1),
  (24, 'GMR', 'not yet', 1),
  (25, 'GMR-CG', 'not yet', 1),
  (26, 'GMR-EMCO', 'not yet', 1),
  (27, 'GPEC', 'not yet', 1),
  (28, 'GSECL', 'not yet', 1),
  (29, 'HAZIRA-IPP', 'not yet', 1),
  (30, 'IEPL', 'not yet', 1),
  (31, 'JAIGAD-IPP', 'not yet', 1),
  (32, 'Jaypee', 'not yet', 1),
  (33, 'Jhabua Power', 'not yet', 1),
  (34, 'Jhabua Power Ltd', 'not yet', 1),
  (35, 'JPL', 'not yet', 1),
  (36, 'JPTL', 'not yet', 1),
  (37, 'JPVL', 'not yet', 1),
  (38, 'JTCL', 'not yet', 1),
  (39, 'KSK', 'not yet', 1),
  (40, 'KWPCL', 'not yet', 1),
  (41, 'LANCO', 'not yet', 1),
  (42, 'Mahan', 'not yet', 1),
  (43, 'MB Power', 'not yet', 1),
  (44, 'MB-Power', 'not yet', 1),
  (45, 'MCCPL', 'not yet', 1),
  (46, 'MEGPTCL', 'not yet', 1),
  (47, 'MEGPTL', 'not yet', 1),
  (48, 'MPPTCL', 'not yet', 1),
  (49, 'MSETCL', 'not yet', 1),
  (50, 'NHPTL', 'not yet', 1),
  (51, 'NPCIL', 'not yet', 1),
  (52, 'NRTS-1', 'not yet', 1),
  (53, 'NSPCL', 'not yet', 1),
  (54, 'NTPC', 'not yet', 1),
  (55, 'OPTCL', 'not yet', 1),
  (56, 'PGCIL', 'not yet', 1),
  (57, 'Ratan India', 'not yet', 1),
  (58, 'Rattan India', 'not yet', 1),
  (59, 'Reliance', 'not yet', 1),
  (60, 'RGPPL', 'not yet', 1),
  (61, 'RKM', 'not yet', 1),
  (62, 'RKMPPL', 'not yet', 1),
  (63, 'RSPTCL', 'not yet', 1),
  (64, 'RTCL', 'not yet', 1),
  (65, 'SKS', 'not yet', 1),
  (66, 'SPGCL', 'not yet', 1),
  (67, 'SPL', 'not yet', 1),
  (68, 'SRTCL', 'not yet', 1),
  (69, 'SRTS-1', 'not yet', 1),
  (70, 'SSNL', 'not yet', 1),
  (71, 'SSNNL', 'not yet', 1),
  (72, 'TPL', 'not yet', 1),
  (73, 'TRN', 'not yet', 1),
  (74, 'UPPTCL', 'not yet', 1),
  (75, 'Vandana Vidyut', 'not yet', 1),
  (76, 'WRST-2', 'not yet', 1),
  (77, 'WRTGPL', 'not yet', 1),
  (78, 'WRTMPL', 'not yet', 1),
  (79, 'WRTS-1', 'not yet', 1),
  (80, 'WRTS-2', 'not yet', 1);

--
-- Dumping data for table `conductor_types`
--

INSERT INTO `conductor_types` (`id`, `name`) VALUES
  (1, 'Twin ACSR Moose'),
  (2, 'Quad ACSR Moose'),
  (3, 'Triple ACSR Snowbird'),
  (4, 'Quad Bersimis'),
  (5, 'Quad AAAC Moose');

--
-- Dumping data for table `element_types`
--

INSERT INTO `element_types` (`id`, `type`) VALUES
  (1, 'FSC'),
  (2, 'Bus'),
  (3, 'Bus Capacitor'),
  (4, 'FACTS'),
  (5, 'Generator'),
  (6, 'HVDC Station'),
  (7, 'ICT'),
  (8, 'Line'),
  (9, 'Bus Reactor'),
  (10, 'TCSC'),
  (11, 'Line Reactor'),
  (12, 'Bus Coupler'),
  (13, 'SVC'),
  (14, 'Bay'),
  (15, 'Station Transformer'),
  (16, 'Substation');


--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `name`) VALUES
  (1, 'Andhra Pradesh'),
  (2, 'Arunachal Pradesh'),
  (3, 'Assam'),
  (4, 'Chhattisgarh'),
  (5, 'Bihar'),
  (6, 'Gujarat'),
  (7, 'Goa'),
  (8, 'Haryana'),
  (9, 'Himachal Pradesh'),
  (10, 'Jammu and Kashmir'),
  (11, 'Jammu (Winter)'),
  (12, 'Jharkhand'),
  (13, 'Karnataka'),
  (14, 'Kerala'),
  (15, 'Madhya Pradesh'),
  (16, 'Maharashtra'),
  (17, 'Manipur'),
  (18, 'Meghalaya'),
  (19, 'Mizoram'),
  (20, 'Nagaland'),
  (21, 'Odisha'),
  (22, 'Punjab'),
  (23, 'Rajasthan'),
  (24, 'Sikkim'),
  (25, 'Tamil Nadu'),
  (26, 'Telangana'),
  (27, 'Tripura'),
  (28, 'Uttarakhand'),
  (29, 'Uttar Pradesh'),
  (30, 'West Bengal'),
  (31, 'Andaman and Nicobar Islands'),
  (32, 'Chandigarh'),
  (33, 'Dadra and Nagar Haveli'),
  (34, 'Daman and Diu'),
  (35, 'Delhi'),
  (36, 'Lakshadweep'),
  (37, 'Puducherry');

--
-- Dumping data for table `voltages`
--

INSERT INTO `voltages` (`id`, `level`) VALUES
  (1, '765'),
  (2, '1200'),
  (3, '220'),
  (4, '400'),
  (5, '132'),
  (6, '66'),
  (7, '765/400'),
  (8, '400/220'),
  (9, '400/132'),
  (10, '220/66'),
  (11, '220/132');