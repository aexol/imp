# Imp CLI 

Hello on the imp page! Imp is an open source <b>Imp</b>lementation manager, which will
boost your dev ops to the moon. Create your own file implementations in seconds.

## Installation
```sh
$ npm install -g imp-manager
```

## Search

```sh
$ imp search <query>
```
Search implementations

## Get

```sh
$ imp get <name> <version> <path>
```
Get implementation


## Login
```sh
$ imp login <username> <password>
```
You have to login to use all features of this CLI


## Register
```sh
$ imp login <username> <password> <repeat_password>
```

This will log you in automatically of course too.
You need to be logged in to use: init, update, rm


## Init

```sh
$ imp init <name>
```
Init new implementation

## Update 

```sh
$ imp update <name> <version> <path> 
```

Every time you run update it creates a new object in database. So if you create two objects with the same name and version. System will give you the latest one.

## Rm 

```sh
$ imp rm <name>
```

Remove all imp versions and implementation itself from imp database