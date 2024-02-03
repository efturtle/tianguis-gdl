CREATE TABLE tianguis (
	id UUID PRIMARY KEY,
	nombre varchar(255) NOT NULL,
	ciudad varchar(255),
	empieza varchar(255) NOT NULL,
	termina varchar(255) NOT NULL,
	fecha_creada timestamp DEFAULT (datetime('now')),
	fecha_actualizada timestamp DEFAULT (datetime('now'))
);
