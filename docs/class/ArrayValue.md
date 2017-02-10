#ArrayValue

关于 ArrayValue 的用法:

1. 关联数组

`{
  "name": "TestData",
  "members": {
    "people": {
      "type": "Array",
      "typeValue": "PeopleData"
    },
    "men": {
      "type": "Array",
      "typeValue": "PeopleData",
      "sub": {
        "source": "people",
        "type": "sex",
        "value": "man"
      }
    },
    "women": {
      "type": "Array",
      "typeValue": "PeopleData",
      "sub": {
        "source": "people",
        "type": [
          "sex"
        ],
        "value": [
          "woman"
        ]
      }
    },
    "children": {
      "type": "Array",
      "typeValue": "PeopleData",
      "sub": {
        "source": "people",
        "type": "ageType",
        "value": "child"
      }
    },
    "youngPeople": {
      "type": "Array",
      "typeValue": "PeopleData",
      "sub": {
        "source": "people",
        "type": "ageType",
        "value": "young"
      }
    },
    "oldPeople": {
      "type": "Array",
      "typeValue": "PeopleData",
      "sub": {
        "source": "people",
        "type": "ageType",
        "value": "old"
      }
    }
  }
}`

2. 绑定 for 循环

`flower.DataManager.addDefine({
    "name": "TestData",
    "members": {
        "current": {"type": "number"},
        "max": {"type": "number"},
        "percent": {"type": "int", "bind": "{for(list,$s+=$i.x)}"},
        "list": {"type": "Array", "typeValue": "Point"},
        "tip": {"type": "string"}
    },
    "script": e.data
});
var d = flower.DataManager.createData("TestData");
d.value = {list: [{x:3,y:1}, {x:4,y:2}, {x:5,y:3}]};
console.log(d.percent.value); //12
d.list[0].x = 8;
console.log(d.percent.value); //17
var item = d.list.shift();
item.x = 12;
console.log(d.percent.value); //9`