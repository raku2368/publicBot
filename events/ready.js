module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        let number = 0
        setInterval(() => {
            const list = ["구독눌러주세요", "좋아요 눌러주세요" , "안녕하세요" , "테스트"]
            if(number == list.length) number = 0
            client.user.setActivity(list[number],{
                type:"PLAYING"
            })
            number++
        }, 2000) //몇초마다 상태메세지를 바꿀지 정해주세요 (1000 = 1초)
        console.log(`${client.user.tag} 로그인`);
    },
  };