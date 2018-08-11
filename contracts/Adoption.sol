pragma solidity ^0.4.2;

contract Adoption{

    // 変数宣言
    address[16] public adopters;
	
	    // 整数型のpetIdを入れると結果が整数型で返ってくる関数
    function adopt(uint petId) public returns (uint){
        // ペットは16匹しかいないので、範囲外のリクエストが来たら終わりとする
        require(petId>=0 && petId<=15);

        adopters[petId] = msg.sender; //トランザクション実行者のアドレスを入れ込む

        return petId; // petIdを返す
    }
	
	    // adoptersの状況を取得する関数
    function getAdopters() public view returns (address[16]){

        return adopters;
    }
	
	
}