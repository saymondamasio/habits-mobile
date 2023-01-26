import { RouteProp, useRoute } from "@react-navigation/native";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { HabitEmpty } from "../components/HabitEmpty";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

type HabitParams = {
  date: string;
};

type DayInfo = {
  possibleHabits: Array<{
    id: string;
    title: string;
  }>;
  completedHabits: string[];
};

export function Habit() {
  const route = useRoute();
  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const [isLoading, setIsLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfo | null>(null);

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        dayInfo.completedHabits.length
      )
    : 0;

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    try {
      setIsLoading(true);

      const response = await api.get("day", { params: { date } });
      setDayInfo(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Não foi possível carregar os hábitos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`habits/${habitId}/toggle`);

      if (dayInfo?.completedHabits.includes(habitId)) {
        setDayInfo((oldState) => ({
          possibleHabits: dayInfo.possibleHabits,
          completedHabits: oldState!.completedHabits.filter(
            (id) => id !== habitId
          ),
        }));
      } else {
        setDayInfo((oldState) => ({
          possibleHabits: dayInfo!.possibleHabits,
          completedHabits: [...dayInfo!.completedHabits, habitId],
        }));
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar atualizar o hábito.");
    }
  }

  if (isLoading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            "opacity-50": isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits.length ? (
            dayInfo.possibleHabits.map((habit, index) => (
              <Checkbox
                key={habit.id}
                label={habit.title}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
                checked={dayInfo.completedHabits.includes(habit.id)}
              />
            ))
          ) : (
            <HabitEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar hábitos de uma data passada.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
