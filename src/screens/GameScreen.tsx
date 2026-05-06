import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { Card } from '../types';
import { cards as allCards } from '../data/cards';
import { filterCards, shuffle } from '../engine/cardUtils';
import { getPhaseColor } from '../engine/sessionUtils';
import CardDisplay from '../components/CardDisplay';
import TimerDisplay from '../components/TimerDisplay';
import SessionBar from '../components/SessionBar';
import Header from '../components/Header';

export default function GameScreen({ navigation }: any) {
  const {
    mode, level, isPro, useCard, saveCard, isCardSaved, dailyCardsUsed,
    isSessionMode, sessionCardIndex, sessionCards,
    nextSessionCard, getCurrentPhase, isProOrTrial,
  } = useGame();

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerDone, setIsTimerDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Filtrado inicial de cartas
  const filtered = filterCards(allCards, mode, level, isProOrTrial());

  useEffect(() => {
    if (isSessionMode && sessionCards.length > 0) {
      setCards(sessionCards);
      setCurrentCard(sessionCards[0]);
    } else {
      setCards(shuffle(filtered));
      if (filtered.length > 0) setCurrentCard(filtered[0]);
    }
  }, [isSessionMode, sessionCards]);

  useEffect(() => {
    if (currentCard?.tiene_tiempo && currentCard.tiempo_segundos) {
      setTimeLeft(currentCard.tiempo_segundos);
      setIsTimerRunning(false);
      setIsTimerDone(false);
    } else {
      setIsTimerRunning(false);
      setTimeLeft(0);
    }
  }, [currentCard?.id]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsTimerDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning]);

  useEffect(() => {
    if (isTimerDone) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTimerDone]);

  const handleNext = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isSessionMode) {
      nextSessionCard();
      setIsTimerDone(false);
      return;
    }
    if (dailyCardsUsed >= 10 && !isProOrTrial()) { navigation.navigate('DailyLimit'); return; }
    useCard();
    const idx = cards.findIndex(c => c.id === currentCard?.id) + 1;
    if (idx >= cards.length) setCards(shuffle(filtered));
    else setCurrentCard(cards[idx]);
    setIsTimerDone(false);
  },     [cards, currentCard, dailyCardsUsed, isProOrTrial, isSessionMode, nextSessionCard]);

  const startTimer = () => {
    if (currentCard?.tiene_tiempo && currentCard.tiempo_segundos) {
      setTimeLeft(currentCard.tiempo_segundos);
      setIsTimerRunning(true);
      setIsTimerDone(false);
    }
  };

  if (!currentCard) return <View style={styles.container}><Text style={styles.loading}>Cargando...</Text></View>;

  const maxTime = currentCard.tiene_tiempo ? (currentCard.tiempo_segundos || 1) : 1;

  return (
    <View style={styles.container}>
      <Header
        onBack={() => navigation.goBack()}
        centerContent={
          isSessionMode ? (
            <SessionBar currentIndex={sessionCardIndex} />
          ) : (
            <View style={styles.progress}>
              <Text style={styles.progressText}>{cards.findIndex(c => c.id === currentCard.id) + 1} / {cards.length}</Text>
            </View>
          )
        }
        rightContent={
          <TouchableOpacity onPress={() => navigation.navigate('SavedCards')}>
            <Text style={styles.saveBtn}>♥</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.cardContainer} contentContainerStyle={styles.cardContent}>
        <CardDisplay
          card={currentCard}
          isSessionMode={isSessionMode}
          sessionColor={isSessionMode ? getPhaseColor(getCurrentPhase()) : undefined}
        />

        {currentCard.tiene_tiempo && (
          <TimerDisplay
            timeLeft={timeLeft}
            maxTime={maxTime}
            isRunning={isTimerRunning}
            isDone={isTimerDone}
            onStart={startTimer}
            pulseAnim={pulseAnim}
          />
        )}
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => currentCard && saveCard(currentCard.id)}>
          <Text style={styles.actionIcon}>{isCardSaved(currentCard?.id) ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={dailyCardsUsed >= 10 && !isPro ? styles.mainBtnDisabled : styles.mainBtn}
          onPress={handleNext}
        >
          <Text style={styles.mainBtnText}>{dailyCardsUsed >= 10 && !isPro ? 'Límite' : 'Siguiente'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progress: { flex: 1, marginHorizontal: 20 },
  progressText: { color: colors.text, fontSize: 12, textAlign: 'center' },
  saveBtn: { fontSize: 24, color: colors.primary },
  cardContainer: { flex: 1, paddingHorizontal: 20 },
  cardContent: { flexGrow: 1, justifyContent: 'center' },
  actions: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 40, justifyContent: 'center', gap: 16 },
  actionBtn: { padding: 16 },
  actionIcon: { fontSize: 24, color: colors.primary },
  mainBtn: { flex: 1, backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  mainBtnDisabled: { flex: 1, backgroundColor: '#444', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  mainBtnText: { fontSize: 16, fontWeight: '600', color: colors.white },
  loading: { color: colors.text, fontSize: 18, textAlign: 'center', marginTop: 100 },
});
