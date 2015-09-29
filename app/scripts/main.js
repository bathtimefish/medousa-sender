// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// PeerJS object
var peer = new Peer({ key: 'c1dce32b-71cf-4ddf-bfc3-7bd7b492e03e', debug: 3});

// Medosa API
var key = 'de8eXWrSu4Q7E2ezwQBBvRaA';
var api = 'http://dev.bathtimefish.com:10010/v1/sender/';

var peerKey = null;

peer.on('open', function(){
  console.log(peer.id);
  peerKey = peer.id;
  $.ajax({ type:"POST", url:api + key, dataType:"json", data:{ id:peer.id }})
   .then(function(data) {

      if(data.success) {
        // 自分のカメラを映す
        navigator.getUserMedia({audio: true, video: true},
          function(stream){
            // Set your video displays
            $('#sender-video').prop('src', URL.createObjectURL(stream));
            console.log(data);
            // Receiving a call
            peer.on('call', function(call){
              // Answer the call automatically (instead of prompting user) for demo purposes
              call.answer(stream);
              console.log('call');
            });
            peer.on('error', function(err){
              console.error(err.message);
              $('.modal-title').text('Medousa Peer Connection Error');
              $('.modal-body').text(err.message);
              $('#modal').modal();
            });
          },
          function(){
            console.error('cannot get video stream');
          }
        );
      }

   }).fail(function(err) {
     console.error(err.status);
     console.error(err.responseText);
     $('.modal-title').text('Medousa Server Error');
     var res = JSON.parse(err.responseText);
     $('.modal-body').text('Status:'+err.status+' '+res.message);
     $('#modal').modal();
   });
});



$('#restart').click(function() {
  window.location.reload(true);
});
