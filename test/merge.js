const users = [
    {"id": 1, "name": "a"},
    {"id": 2, "name": "b"},
    {"id": 3, "name": "e"},
    {"id": 4, "name": "c"},
    {"id": 5, "name": "d"},
];

const item_logs = [
    {"id": 100, "op": "add", "uid": 1, "item_id": 1},
    {"id": 101, "op": "add", "uid": 2, "item_id": 1},
    {"id": 102, "op": "add", "uid": 3, "item_id": 2},
];

const new_item_logs = item_logs.map(v => {
    const user = users.find(u => {
        return v.uid === u.id
    }) || {};
    v.name = user.name;
    return v
});

const join = () => {
    const itemList = item_logs.filter(v => v.item_id === 1);
    const uids = itemList.map(v => v.uid);
    const userList = users.filter(v => uids.indexOf(v.id) !== -1)
};

const c1 = {
    type:'db',
    metadata:{
        name: "db1",
        dbname: "test",
        colname: "item_log",
        cmd: "find",
        args: [{item_id: 1}, {}],
    },
    context:'itemList'
};

const c2 = {
    type:'cal',
    metadata:{
        cmd:'map',
        args:['context.itemList','(v)=>{v.uid}']
    },
    context:'uids'
};

const c3 = {
    type:'db',
    metadata:{
        name: "db1",
        dbname: "test",
        colname: "user",
        cmd: "find",
        args: [{_id:{$in:'context.uids'}}, {}],
    },
    context:'users'
};

const c4 = {
    type:'cal',
    metadata:{

    }
};

const exec = (ops)=>{
  const context = {};
  for (let i=0;i<cals.length;i++){
      const {type='',metadata={},context=''} = ops[i];
      if (type === 'db'){

      }else if (type === 'cal'){

      }
  }
};
