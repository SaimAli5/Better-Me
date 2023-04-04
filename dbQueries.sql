-- complete postgres database queries

CREATE TABLE daily_list (
  id serial PRIMARY KEY,
  title varchar(255) NOT NULL
);

CREATE TABLE users (
  id serial PRIMARY KEY,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL UNIQUE
);

CREATE TABLE custom_list (
  id serial PRIMARY KEY,
  title varchar(255) NOT NULL,
  users_id integer REFERENCES users(id)
);

CREATE TABLE user_daily_list (
  users_id integer REFERENCES users(id),
  daily_list_id integer REFERENCES daily_list(id),
  PRIMARY KEY (users_id, daily_list_id)
);

CREATE TABLE daily_task (
  id serial PRIMARY KEY,
  title varchar(255) NOT NULL,
  status varchar(100) NOT NULL,
  note varchar(500),
  daily_list_id integer REFERENCES daily_list(id)
);

CREATE TABLE custom_task (
  id serial PRIMARY KEY,
  title varchar(255) NOT NULL,
  status varchar(100) NOT NULL,
  note varchar(500),
  custom_list_id integer REFERENCES custom_list(id)
);