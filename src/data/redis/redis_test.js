

const chunkList = (msgList,size=100)=>{
    const total_count = msgList.length;
    const chunk_size = size;
    const tasks = Math.ceil(total_count/chunk_size);
    const resultList = new Array(tasks.length);
    for (let i=0;i<tasks;i++){
        let msgChunk = [];
        for (let j=0;j<chunk_size;j++){
            const index = i*chunk_size+j;
            if (index < total_count){
                const msg = JSON.stringify(msgList[index]);
                msgChunk.push(msg)
            }
        }
        resultList[i] = msgChunk;
    }
    return resultList;
};