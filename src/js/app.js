App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
  
  if (typeof web3 !== 'undefined'){
    App.web3Provider = web3.currentProvider;
    }else{
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json',function(data){
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffContract(AdoptionArtifact);

      App.contracts.Adoption.setProvider(App.web3Provider);
      // 状態を呼び起こす
      return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
    デプロイしたAdoptionより、getAdoptersをcallする。
    */
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function(instance){
      adoptionInstance = instance;
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters){
      /*
      adoptersを順番に取り出し、「0じゃない」＝すでに引き取られているものがあれば、
      パネルのボタンの文字をSuccessにし、非表示とする
      */
      for(i=0; i<adopters.length; i++){
        if(adopters[i] !== "0x0000000000000000000000000000000000000000"){
          $(".panel-pet").eq(i).find("button").text("Success").attr('disabled', true);
        }
      }
    }).catch(function(err){
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    // アカウントを取得
    web3.eth.getAccounts(function(error, accounts){
      if(error){
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance){
        adoptionInstance = instance;

        // 現在のアカウントでコンストラクトを実行
        return adoptionInstance.adopt(prtId,{from:account});
    }).then(function(result){

      // markAdoptedを行って表示を更新する
      return App.markAdopted();
    }).catch(function(err){
      console.log(err.message);
    });
  });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
