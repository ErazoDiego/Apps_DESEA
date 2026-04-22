import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { Card } from '../types';
import { cards as allCards } from '../data/cards';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GameScreen({ navigation }: any) {
  const { mode, level, isPro, useCard, saveCard, isCardSaved, dailyCardsUsed } = useGame();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerDone, setIsTimerDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const filtered = allCards.filter(c => {
    if (mode === 'el' && c.dirigida_a !== 'mixta' && c.dirigida_a !== 'el') return false;
    if (mode === 'ella' && c.dirigida_a !== 'mixta' && c.dirigida_a !== 'ella') return false;
    if (level === 'suave' && c.nivel !== 'suave') return false;
    if (level === 'picante' && c.nivel !== 'suave' && c.nivel !== 'picante') return false;
    if (c.nivel === 'fuego' && !isPro) return false;
    return true;
  });

  console.log('DEBUG:', { mode, level, isPro, totalCards: allCards.length, filteredCount: filtered.length });

  useEffect(() => { setCards(shuffle(filtered)); }, []);
  useEffect(() => { if (cards.length > 0) setCurrentCard(cards[0]); }, [cards]);

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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
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
    if (dailyCardsUsed >= 10 && !isPro) { navigation.navigate('DailyLimit'); return; }
    useCard();
    const idx = cards.findIndex(c => c.id === currentCard?.id) + 1;
    if (idx >= cards.length) setCards(shuffle(filtered));
    else setCurrentCard(cards[idx]);
    setIsTimerDone(false);
  }, [cards, currentCard, dailyCardsUsed, isPro]);

  const startTimer = () => {
    if (currentCard?.tiene_tiempo && currentCard.tiempo_segundos) {
      setTimeLeft(currentCard.tiempo_segundos);
      setIsTimerRunning(true);
      setIsTimerDone(false);
    }
  };

  const getCategoryLabel = (c: string) => c === 'verdad' ? 'VERDAD' : c === 'reto' ? 'RETO' : c.toUpperCase();
  const getLevelColor = (n: string) => n === 'suave' ? '#10B981' : n === 'picante' ? '#F59E0B' : '#EF4444';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}`;
  };

  if (!currentCard) return <View style={styles.container}><Text style={styles.loading}>Cargando...</Text></View>;

  const maxTime = currentCard.tiempo_segundos || 1;
  const progress = isTimerRunning || isTimerDone ? (isTimerDone ? 0 : timeLeft / maxTime) : 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <View style={styles.progress}><Text style={styles.progressText}>{cards.findIndex(c => c.id === currentCard.id) + 1} / {cards.length}</Text></View>
        <TouchableOpacity onPress={() => navigation.navigate('SavedCards')}><Text style={styles.saveBtn}>♥</Text></TouchableOpacity>
      </View>
      <ScrollView style={styles.cardContainer} contentContainerStyle={styles.cardContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.badge, { backgroundColor: getLevelColor(currentCard.nivel) }]}>
              <Text style={styles.badgeText}>{getCategoryLabel(currentCard.category)}</Text>
            </View>
            <View style={[styles.badge, { borderColor: getLevelColor(currentCard.nivel), borderWidth: 1 }]}>
              <Text style={[styles.badgeText, { color: getLevelColor(currentCard.nivel) }]}>{currentCard.nivel.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.cardText}>{currentCard.texto}</Text>
          
          {currentCard.tiene_tiempo && (
            <View style={styles.timerContainer}>
              <View style={styles.timerBar}>
                <View style={[styles.timerProgress, { width: `${progress * 100}%`, backgroundColor: isTimerDone ? '#EF4444' : colors.accent }]} />
              </View>
              {isTimerDone ? (
                <Animated.View style={[styles.timerDisplay, { transform: [{ scale: pulseAnim }] }]}>
                  <Text style={styles.timerDoneText}>¡TIEMPO!</Text>
                </Animated.View>
              ) : (
                <View style={styles.timerDisplay}>
                  <Text style={styles.timerIcon}>⏱</Text>
                  <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>
              )}
              {!isTimerRunning && !isTimerDone && (
                <TouchableOpacity style={styles.startTimerBtn} onPress={startTimer}>
                  <Text style={styles.startTimerText}>INICIAR</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => currentCard && saveCard(currentCard.id)}>
          <Text style={styles.actionIcon}>{isCardSaved(currentCard?.id) ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dailyCardsUsed >= 10 && !isPro ? styles.mainBtnDisabled : styles.mainBtn} onPress={handleNext}>
          <Text style={styles.mainBtnText}>{dailyCardsUsed >= 10 && !isPro ? 'Límite' : 'Siguiente'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  progress: { flex: 1, marginHorizontal: 20 },
  progressText: { color: colors.text, fontSize: 12, textAlign: 'center' },
  saveBtn: { fontSize: 24, color: colors.primary },
  cardContainer: { flex: 1, paddingHorizontal: 20 },
  cardContent: { flexGrow: 1, justifyContent: 'center' },
  card: { backgroundColor: colors.cardSurface, borderRadius: 24, padding: 32, minHeight: 300, justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  cardText: { fontSize: 22, color: colors.text, textAlign: 'center', lineHeight: 32 },
  timerContainer: { marginTop: 24, alignItems: 'center' },
  timerBar: { width: '100%', height: 8, backgroundColor: colors.background, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  timerProgress: { height: '100%', borderRadius: 4 },
  timerDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timerIcon: { fontSize: 20 },
  timerText: { fontSize: 32, fontWeight: '700', color: colors.text },
  timerDoneText: { fontSize: 32, fontWeight: '700', color: '#EF4444' },
  startTimerBtn: { marginTop: 12, backgroundColor: colors.accent, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 20 },
  startTimerText: { fontSize: 14, fontWeight: '600', color: colors.background },
  actions: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 40, justifyContent: 'center', gap: 16 },
  actionBtn: { padding: 16 },
  actionIcon: { fontSize: 24, color: colors.primary },
  mainBtn: { flex: 1, backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  mainBtnDisabled: { flex: 1, backgroundColor: '#444', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  mainBtnText: { fontSize: 16, fontWeight: '600', color: colors.white },
  loading: { color: colors.text, fontSize: 18, textAlign: 'center', marginTop: 100 },
});