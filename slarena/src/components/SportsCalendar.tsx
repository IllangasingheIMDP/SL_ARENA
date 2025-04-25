import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Match {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  type: 'league' | 'tournament' | 'friendly';
}

const SportsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sample matches data
  const matches: Match[] = [
    {
      id: '1',
      date: '2024-03-20',
      time: '15:00',
      homeTeam: 'Team Alpha',
      awayTeam: 'Team Beta',
      venue: 'Main Stadium',
      type: 'league',
    },
    {
      id: '2',
      date: '2024-03-22',
      time: '18:30',
      homeTeam: 'Team Gamma',
      awayTeam: 'Team Delta',
      venue: 'Sports Complex',
      type: 'tournament',
    },
    {
      id: '3',
      date: '2024-03-25',
      time: '16:00',
      homeTeam: 'Team Epsilon',
      awayTeam: 'Team Zeta',
      venue: 'Community Ground',
      type: 'friendly',
    },
  ];

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'league':
        return '#1a237e';
      case 'tournament':
        return '#d32f2f';
      case 'friendly':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add week day headers
    const weekDayHeaders = weekDays.map((day, index) => (
      <View key={`weekday-${index}`} style={styles.weekDayHeader}>
        <Text style={styles.weekDayText}>{day}</Text>
      </View>
    ));

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const hasMatch = matches.some(match => match.date === date.toISOString().split('T')[0]);
      
      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.calendarDay,
            hasMatch && styles.dayWithMatch,
            date.toDateString() === selectedDate.toDateString() && styles.selectedDay
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[
            styles.dayText,
            date.toDateString() === selectedDate.toDateString() && styles.selectedDayText
          ]}>
            {day}
          </Text>
          {hasMatch && <View style={styles.matchDot} />}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(newDate.getMonth() - 1);
            setCurrentMonth(newDate);
          }}>
            <Icon name="chevron-left" size={24} color="#1a237e" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(newDate.getMonth() + 1);
            setCurrentMonth(newDate);
          }}>
            <Icon name="chevron-right" size={24} color="#1a237e" />
          </TouchableOpacity>
        </View>
        <View style={styles.weekDaysContainer}>
          {weekDayHeaders}
        </View>
        <View style={styles.calendarGrid}>
          {days}
        </View>
      </View>
    );
  };

  const renderMatchCard = (match: Match) => (
    <View key={match.id} style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View style={[styles.matchType, { backgroundColor: getMatchTypeColor(match.type) }]}>
          <Text style={styles.matchTypeText}>{match.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.matchTime}>{match.time}</Text>
      </View>
      
      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          <Text style={styles.teamName}>{match.homeTeam}</Text>
          <Text style={styles.vs}>VS</Text>
          <Text style={styles.teamName}>{match.awayTeam}</Text>
        </View>
      </View>

      <View style={styles.matchFooter}>
        <Icon name="location-on" size={16} color="#666" />
        <Text style={styles.venue}>{match.venue}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sports Calendar</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="arrow-forward" size={16} color="#1a237e" />
        </TouchableOpacity>
      </View>

      {renderCalendar()}

      <View style={styles.matchesSection}>
        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        <ScrollView 
          style={styles.matchesContainer}
          showsVerticalScrollIndicator={false}
        >
          {matches.map(renderMatchCard)}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    letterSpacing: 0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#1a237e',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: '#1a237e',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dayWithMatch: {
    position: 'relative',
  },
  matchDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1a237e',
  },
  matchesSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 15,
  },
  matchesContainer: {
    maxHeight: 300,
  },
  matchCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#1a237e',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchType: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  teamsContainer: {
    marginVertical: 10,
  },
  team: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  vs: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
    fontWeight: '500',
  },
  matchFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  venue: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});

export default SportsCalendar; 