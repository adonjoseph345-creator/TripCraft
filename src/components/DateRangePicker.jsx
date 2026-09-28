import { useState, useRef, useEffect } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date) {
  if (!date) return '';
  const d = date.getDate().toString().padStart(2, '0');
  const m = MONTHS[date.getMonth()].slice(0, 3);
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(day, start, end) {
  if (!start || !end) return false;
  return day > start && day < end;
}

function diffInDays(start, end) {
  if (!start || !end) return 0;
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function DateRangePicker({ startDate, endDate, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selecting, setSelecting] = useState('start'); // 'start' or 'end'
  const [hoveredDate, setHoveredDate] = useState(null);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDayClick = (day) => {
    if (day < today) return; // Can't select past dates

    if (selecting === 'start') {
      onChange(day, null);
      setSelecting('end');
    } else {
      if (day <= startDate) {
        // If user picks a date before or equal to start, reset start
        onChange(day, null);
        setSelecting('end');
      } else {
        onChange(startDate, day);
        setSelecting('start');
        setOpen(false);
      }
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const days = [];
  // Empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    days.push(<div className="drp-day drp-empty" key={`empty-${i}`} />);
  }
  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    date.setHours(0, 0, 0, 0);
    const isPast = date < today;
    const isStart = isSameDay(date, startDate);
    const isEnd = isSameDay(date, endDate);
    const inRange = isInRange(date, startDate, endDate);
    const isHoverRange =
      selecting === 'end' &&
      startDate &&
      !endDate &&
      hoveredDate &&
      date > startDate &&
      date <= hoveredDate;

    let cls = 'drp-day';
    if (isPast) cls += ' drp-disabled';
    if (isStart) cls += ' drp-start';
    if (isEnd) cls += ' drp-end';
    if (inRange || isHoverRange) cls += ' drp-in-range';
    if (isSameDay(date, today)) cls += ' drp-today';

    days.push(
      <div
        className={cls}
        key={d}
        onClick={() => !isPast && handleDayClick(date)}
        onMouseEnter={() => setHoveredDate(date)}
        onMouseLeave={() => setHoveredDate(null)}
      >
        {d}
      </div>
    );
  }

  const totalDays = diffInDays(startDate, endDate);

  // Display text for the field
  let displayText = 'Select dates';
  if (startDate && endDate) {
    displayText = `${formatDate(startDate)} → ${formatDate(endDate)}`;
  } else if (startDate) {
    displayText = `${formatDate(startDate)} → ...`;
  }

  return (
    <div className="drp-wrapper" ref={ref}>
      <div className="trip-search-field">
        <label htmlFor="travel-dates">Travel Dates</label>
        <div
          className="input-wrapper drp-trigger"
          onClick={() => setOpen((o) => !o)}
          role="button"
          tabIndex={0}
          id="travel-dates"
        >
          <span className="input-icon">📅</span>
          <span className={`drp-display ${!startDate ? 'drp-placeholder' : ''}`}>
            {displayText}
          </span>
        </div>
      </div>

      {/* Days badge - shown below the field */}
      {startDate && endDate && (
        <div className="drp-days-badge">
          🎯 <strong>{totalDays} {totalDays === 1 ? 'day' : 'days'}</strong> selected
        </div>
      )}

      {open && (
        <div className="drp-dropdown">
          <div className="drp-header">
            <button type="button" className="drp-nav-btn" onClick={prevMonth}>
              ‹
            </button>
            <span className="drp-month-year">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button type="button" className="drp-nav-btn" onClick={nextMonth}>
              ›
            </button>
          </div>

          <div className="drp-weekdays">
            {DAYS_OF_WEEK.map((d) => (
              <div className="drp-weekday" key={d}>
                {d}
              </div>
            ))}
          </div>

          <div className="drp-grid">{days}</div>

          <div className="drp-footer">
            {selecting === 'start' && (
              <span className="drp-hint">Select start date</span>
            )}
            {selecting === 'end' && startDate && (
              <span className="drp-hint">Select end date</span>
            )}
            {startDate && endDate && (
              <span className="drp-hint drp-hint-success">
                ✓ {totalDays} {totalDays === 1 ? 'day' : 'days'} selected
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
