== README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

create role and database

```bash
sudo -u postgres createuser -d -P dawn_pg
sudo -u postgres createdb -O dawn_pg dawn_development
```

install imagemagick

```bash
sudo apt-get update
sudo apt-get install imagemagick --fix-missing
```

launch web server, rails livereload, front-end build system

```bash
bundle exec passenger start
guard -P livereload
gulp serve
```

start in production mode

```bash
bundle exec puma -p 3000 -e production
```
possible problems

```bash
cc1plus: error: unrecognized command line option "-std=c++0x"
```
fix:
```bash
echo 'export CXX=/usr/bin/gcc-3.3' >> ~/.bashrc
```

Please feel free to use a different markup language if you do not plan to run
<tt>rake doc:app</tt>.