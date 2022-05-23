import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/audioplayer.module.css";
import leftArrow from "../images/Backward.png";
import rightArrow from "../images/Forward.png";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import logo from "../images/Logo.png";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // const [currentAlert, setCurrentAlert] = useState(false);

  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - 10);
    changeRange();
  };

  const forwardThirty = () => {
    progressBar.current.value = Number(audioPlayer.current.currentTime + 30);
    changeRange();
  };

  const songs = {
    MRC_Branding: {
      src: "https://media.nature.com/original/magazine-assets/d41586-022-01403-w/d41586-022-01403-w_20424894.mpga",
      logo: "../images/Logo.png",
      title: "Aristotle Pt. 1",
      paragraph: "Philosophize This!",
    },
  };

  // const alert = () => {
  //   console.log(currentAlert);
  //   setCurrentAlert(!currentAlert);
  // };

  return (
    <div>
      <div>
        <img src={logo.src} />
      </div>

      <div className={styles.audioPlayer}>
        {/* <button onClick={alert}>Hej</button> */}
        <audio
          ref={audioPlayer}
          src={songs.MRC_Branding.src}
          preload="metadata"
        ></audio>
      </div>
      <div className="wrap">
        <input
          type="range"
          className={styles.progressBar}
          defaultValue="0"
          ref={progressBar}
          onChange={changeRange}
        />
        <div className={styles.wrap_name}>
          <div className={styles.currentTime}>{calculateTime(currentTime)}</div>
          <div className={styles.duration}>
            {duration && !isNaN(duration) && calculateTime(duration)}
          </div>
        </div>

        <div className={styles.text}>
          <h3>{songs.MRC_Branding.title}</h3>
          <p>{songs.MRC_Branding.paragraph}</p>
        </div>
        <div className={styles.buttons}>
          <button className={styles.forwardBackward} onClick={backThirty}>
            <img src={leftArrow.src} />
          </button>
          <button onClick={togglePlayPause} className={styles.playPause}>
            {isPlaying ? <FaPause /> : <FaPlay className={styles.play} />}
          </button>
          <button className={styles.forwardBackward} onClick={forwardThirty}>
            <img src={rightArrow.src} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default AudioPlayer;
