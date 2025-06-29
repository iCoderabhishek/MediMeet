import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export const VideoCallScreen = ({ navigation, route }: any) => {
  const { sessionId, token, appointmentId } = route.params;
  const webViewRef = useRef<WebView>(null);
  const [isConnected, setIsConnected] = useState(false);

  const videoCallHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Video Call</title>
        <script src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"></script>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #0F172A;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                overflow: hidden;
            }
            
            .video-container {
                position: relative;
                width: 100vw;
                height: 100vh;
                display: flex;
                flex-direction: column;
            }
            
            .videos {
                flex: 1;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                padding: 8px;
            }
            
            .video-wrapper {
                position: relative;
                background-color: #1E293B;
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid #334155;
            }
            
            .video-wrapper.active {
                border-color: #10B981;
            }
            
            .video-label {
                position: absolute;
                top: 8px;
                left: 8px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10;
            }
            
            .placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #64748B;
                font-size: 48px;
            }
            
            .controls {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 16px;
                z-index: 20;
            }
            
            .control-btn {
                width: 56px;
                height: 56px;
                border-radius: 28px;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .control-btn.video {
                background-color: #1E293B;
                color: white;
            }
            
            .control-btn.video.off {
                background-color: #EF4444;
            }
            
            .control-btn.audio {
                background-color: #1E293B;
                color: white;
            }
            
            .control-btn.audio.off {
                background-color: #EF4444;
            }
            
            .control-btn.end {
                background-color: #EF4444;
                color: white;
            }
            
            .status {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 10;
            }
        </style>
    </head>
    <body>
        <div class="video-container">
            <div class="status" id="status">Connecting...</div>
            
            <div class="videos">
                <div class="video-wrapper active" id="publisher-wrapper">
                    <div class="video-label">You</div>
                    <div id="publisher">
                        <div class="placeholder">👤</div>
                    </div>
                </div>
                
                <div class="video-wrapper" id="subscriber-wrapper">
                    <div class="video-label">Other Participant</div>
                    <div id="subscriber">
                        <div class="placeholder">👤</div>
                    </div>
                </div>
            </div>
            
            <div class="controls">
                <button class="control-btn video" id="videoBtn" onclick="toggleVideo()">
                    📹
                </button>
                <button class="control-btn audio" id="audioBtn" onclick="toggleAudio()">
                    🎤
                </button>
                <button class="control-btn end" onclick="endCall()">
                    📞
                </button>
            </div>
        </div>

        <script>
            const appId = "${process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID}";
            const sessionId = "${sessionId}";
            const token = "${token}";
            
            let session;
            let publisher;
            let isVideoEnabled = true;
            let isAudioEnabled = true;
            
            function updateStatus(message) {
                document.getElementById('status').textContent = message;
            }
            
            function initializeSession() {
                session = OT.initSession(appId, sessionId);
                
                session.on('streamCreated', function(event) {
                    console.log('New stream created');
                    session.subscribe(event.stream, 'subscriber', {
                        insertMode: 'replace',
                        width: '100%',
                        height: '100%'
                    }, function(error) {
                        if (error) {
                            console.error('Error subscribing to stream:', error);
                        } else {
                            document.querySelector('#subscriber .placeholder').style.display = 'none';
                            document.getElementById('subscriber-wrapper').classList.add('active');
                        }
                    });
                });
                
                session.on('sessionConnected', function() {
                    updateStatus('Connected');
                    
                    publisher = OT.initPublisher('publisher', {
                        insertMode: 'replace',
                        width: '100%',
                        height: '100%',
                        publishAudio: isAudioEnabled,
                        publishVideo: isVideoEnabled
                    }, function(error) {
                        if (error) {
                            console.error('Publisher error:', error);
                        } else {
                            document.querySelector('#publisher .placeholder').style.display = 'none';
                            session.publish(publisher);
                        }
                    });
                });
                
                session.on('sessionDisconnected', function() {
                    updateStatus('Disconnected');
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'callEnded'
                    }));
                });
                
                session.connect(token, function(error) {
                    if (error) {
                        console.error('Error connecting to session:', error);
                        updateStatus('Connection failed');
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'error',
                            message: 'Failed to connect to video session'
                        }));
                    }
                });
            }
            
            function toggleVideo() {
                if (publisher) {
                    isVideoEnabled = !isVideoEnabled;
                    publisher.publishVideo(isVideoEnabled);
                    
                    const btn = document.getElementById('videoBtn');
                    if (isVideoEnabled) {
                        btn.textContent = '📹';
                        btn.classList.remove('off');
                    } else {
                        btn.textContent = '📹';
                        btn.classList.add('off');
                    }
                }
            }
            
            function toggleAudio() {
                if (publisher) {
                    isAudioEnabled = !isAudioEnabled;
                    publisher.publishAudio(isAudioEnabled);
                    
                    const btn = document.getElementById('audioBtn');
                    if (isAudioEnabled) {
                        btn.textContent = '🎤';
                        btn.classList.remove('off');
                    } else {
                        btn.textContent = '🔇';
                        btn.classList.add('off');
                    }
                }
            }
            
            function endCall() {
                if (publisher) {
                    publisher.destroy();
                }
                if (session) {
                    session.disconnect();
                }
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'callEnded'
                }));
            }
            
            // Initialize when page loads
            if (typeof OT !== 'undefined') {
                initializeSession();
            } else {
                updateStatus('Loading video components...');
                setTimeout(initializeSession, 1000);
            }
        </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'callEnded':
          navigation.goBack();
          break;
        case 'error':
          Alert.alert('Video Call Error', data.message);
          navigation.goBack();
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end the video call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => {
            webViewRef.current?.postMessage(JSON.stringify({ type: 'endCall' }));
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Video Consultation</Text>
        <TouchableOpacity onPress={handleEndCall} style={styles.endButton}>
          <Text style={styles.endButtonText}>End Call</Text>
        </TouchableOpacity>
      </View>
      
      <WebView
        ref={webViewRef}
        source={{ html: videoCallHTML }}
        style={styles.webView}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        mixedContentMode="compatibility"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  endButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  endButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  webView: {
    flex: 1,
  },
});