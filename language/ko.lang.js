var Lang = {};

Lang.Title = "에프IRC";

Lang.Interface = {};
Lang.Interface.connectWindow = "서버접속";
Lang.Interface.channelListWindow = "전체채널목록";
Lang.Interface.insertServer = "서버주소나 아이피를 입력하세요.";
Lang.Interface.insertPort = "포트를 입력하세요. (예:6444)";
Lang.Interface.insertSecurity = "보안포트를 입력하세요. (기본:843)";
Lang.Interface.selectEncode = "서버인코딩을 선택하세요.";
Lang.Interface.insertNickname = "닉네임을 입력하세요.";
Lang.Interface.insertChannel = "채널명을 입력하세요. (옵션)";
Lang.Interface.insertPassword = "채널패스워드를 입력하세요. (옵션)";
Lang.Interface.page = "페이지";
Lang.Interface.error = "에러";
Lang.Interface.channelName = "채널명";
Lang.Interface.userName = "유저명";
Lang.Interface.userNum = "유저수";
Lang.Interface.topic = "채널토픽";
Lang.Interface.userCountUnit = "{count}명";
Lang.Interface.searchChannel = "채널명검색";
Lang.Interface.channelJoin = "채널참여";
Lang.Interface.channelKey = "{channel}채널은 패스워드가 필요합니다.";
Lang.Interface.Optional = "선택";
Lang.Interface.limitAndKeyConfig = "채널최대참여인원 및 채널패스워드 설정";
Lang.Interface.limitConfig = "최대참여인원";
Lang.Interface.keyConfig = "채널패스워드";
Lang.Interface.channelDetailConfig = "채널세부설정";
Lang.Interface.changeChannelTopic = "채널토픽변경";
Lang.Interface.changeNickname = "닉네임변경";
Lang.Interface.queryWindowTitle = "{nickname}님과의 개인대화";
Lang.Interface.banNickname = "차단조건";
Lang.Interface.banFrom = "차단한사람";
Lang.Interface.banTime = "차단시간";
Lang.Interface.searchBan = "차단자검색";

Lang.Button = {};
Lang.Button.connect = "서버접속";
Lang.Button.channelJoin = "채널참여";
Lang.Button.channelList = "전체채널보기";
Lang.Button.selectChannelJoin = "선택채널 참여하기";
Lang.Button.channelListHelp = "채널목록도움말";
Lang.Button.search = "검색";
Lang.Button.channelConfig = "채널설정";
Lang.Button.change = "변경하기";
Lang.Button.channelTopic = "토픽변경";
Lang.Button.changeNickname = "닉네임변경";
Lang.Button.clear = "화면비우기";
Lang.Button.banList = "차단자관리";
Lang.Button.banAdd = "차단조건추가";
Lang.Button.banRemove = "차단조건삭제";
Lang.Button.bold = "굵게";
Lang.Button.underline = "밑줄";
Lang.Button.textColor = "글자색";
Lang.Button.backgroundColor = "배경색";
Lang.Button.whois = "사용자정보보기";
Lang.Button.query = "귓속말보내기";
Lang.Button.ban = "차단하기";
Lang.Button.kick = "추방하기";
Lang.Button.kickBan = "추방 및 차단하기";
Lang.Button.giveOpper = "채널관리권한부여";
Lang.Button.giveVoice = "대화권한부여";
Lang.Button.takeOpper = "채널관리권한해제";
Lang.Button.takeVoice = "대화권한해제";

Lang.Color = {};
Lang.Color.none = "기본";
Lang.Color.white = "흰색";
Lang.Color.black = "검정";
Lang.Color.navy = "파랑";
Lang.Color.green = "초록";
Lang.Color.red = "빨강";
Lang.Color.maroon = "갈색";
Lang.Color.purple = "보라";
Lang.Color.orange = "오렌지";
Lang.Color.yellow = "노랑";
Lang.Color.lime = "밝은초록";
Lang.Color.teal = "청록";
Lang.Color.aqua = "밝은청록";
Lang.Color.blue = "밝은파랑";
Lang.Color.fuchsia = "분홍";
Lang.Color.gray = "회색";
Lang.Color.silver = "밝은회색";

Lang.Msg = {};
Lang.Msg.selectServer = "서버정보(서버주소, 포트, 보안포트, 인코딩)를 입력하세요.";
Lang.Msg.insertNickname = "닉네임을 입력하세요.";
Lang.Msg.insertChannel = "채널명을 입력하세요.";
Lang.Msg.tryConnect = "서버에 접속중입니다.<br />잠시만 기다려주십시오.";
Lang.Msg.waitChannelList = "채널목록을 받아오고 있습니다.<br />잠시만 기다려주십시오.";
Lang.Msg.waitBanList = "차단자목록을 받아오고 있습니다.<br />잠시만 기다려주십시오.";
Lang.Msg.joinChannel = "{channel}채널에 참여하였습니다.";
Lang.Msg.nickChange = "{user}님이 닉네임을 {nickname}으로 변경하였습니다.";
Lang.Msg.getOpper = "{from}님이 {nickname}님에게 채널관리자권한을 부여하였습니다.";
Lang.Msg.getVoice = "{from}님이 {nickname}님에게 대화권한을 부여하였습니다.";
Lang.Msg.takeOpper = "{from}님이 {nickname}님에게 채널관리자권한을 해제하였습니다.";
Lang.Msg.takeVoice = "{from}님이 {nickname}님에게 대화권한을 해제하였습니다.";
Lang.Msg.userJoin = "{nickname}님이 채널에 참여하였습니다.";
Lang.Msg.userPart = "{nickname}님이 채널을 종료하였습니다.";
Lang.Msg.userQuit = "{nickname}님이 IRC를 종료하였습니다.";
Lang.Msg.selectJoinChannel = "참여할 채널을 선택하여 주십시오.";
Lang.Msg.topicChange = "{nickname}님이 채널토픽을 {topic}(으)로 변경하셨습니다.";
Lang.Msg.insertChannelName = "채널명을 입력하여 주세요.";
Lang.Msg.insertChannelKey = "채널 패스워드를 입력하세요.";
Lang.Msg.limitConfig = "입력하지 않으면 제한없음";
Lang.Msg.keyConfig = "입력시 채널입장시 패스워드 필요";
Lang.Msg.channelConfigT = "채널관리권한을 가진 사람만 토픽을 변경할 수 있습니다.(t)";
Lang.Msg.channelConfigI = "초대만으로 채널에 입장할 수 있습니다.(i)";
Lang.Msg.channelConfigN = "채널외부에서 온 메세지를 차단합니다.(n)";
Lang.Msg.channelConfigM = "대화권한(VOICE)가 있는 사람만 말할 수 있습니다.(m)";
Lang.Msg.channelConfigP = "외부사용자가 채널의 정보를 보지못하게 합니다.(p)";
Lang.Msg.channelConfigS = "채널정보보기를 막고, 전체채널목록에 채널이 보이지 않습니다.(s)";
Lang.Msg.channelChange = "{nickname}님이 채널설정을 변경하였습니다. ({mode})";
Lang.Msg.insertChannelTopic = "채널토픽을 입력하여 주세요.";
Lang.Msg.beforeUnload = "페이지를 벗어나면 대화가 종료됩니다.";
Lang.Msg.userBan = "{from}님이 {nickname}님을 이 채널에서 차단하였습니다.";
Lang.Msg.userRemoveBan = "{from}님이 {nickname}님을 이 채널의 차단설정을 해제하였습니다.";
Lang.Msg.selectBanRemove = "해제할 차단조건을 선택하세요.";
Lang.Msg.banNickname = "차단할 닉네임(와일드카드:*)";
Lang.Msg.banRealname = "차단할 리얼네임(와일드카드:*)";
Lang.Msg.banIp = "차단할 아이피(와일드카드:*)";
Lang.Msg.banText = "차단조건식";
Lang.Msg.tryFewSeconds = "잠시후에 다시 시도하여 주십시오.";
Lang.Msg.userKick = "{from}님이 {nickname}님을 추방하였습니다.";
Lang.Msg.myKick = "{from}님이 회원님을 {channel}채널에서 추방하였습니다.";

Lang.Help = {};
Lang.Help.channelList = '<span style="color:#FF0000;">#channelName</span> : 채널입장시 패스워드가 필요한 채널입니다.<br /><span style="color:#324298;">#channelName</span> : 초대로만 참여가 가능한 채널입니다.<br /><br />유저수에 1/50 과 같이 되어 있는 채널의 경우 최대참여자가 50명이라는 의미입니다.';

Lang.Error = {};
Lang.Error.invalidChannel = "채널명이 잘못입력되었습니다.";
Lang.Error.configPermissionError = "채널설정을 변경할 수 있는 권한이 없습니다.<br />채널설정은 채널관리자만 변경할 수 있습니다.";
Lang.Error.DuplicateNickname = "닉네임이 중복됩니다.";
Lang.Error.banChannel = "유저님은 {channel}채널의 차단된 유저목록에 등록되어 있습니다.";
Lang.Error.WrongCommand = "잘못된 명령어 입니다. /? 를 입력하여, 도움말을 참고하여 주십시오.";
Lang.Error.notSupportCommand = "지원하지 않는 명령어입니다. 지원명령어 목록은 /? 를 입력하여 도움말을 참고하여 주십시오.";

Lang.Help = {};
Lang.Help.defaultHelp = "도움말은 아직 제공되지 않습니다.";
