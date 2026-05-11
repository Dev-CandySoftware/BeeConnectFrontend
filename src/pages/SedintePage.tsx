import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ro } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { type Sedinta } from "../types/sedinta";
import { getSedinteMyTeamData, deleteSedintaData, getSedinteAllData } from "../api/sedinte";
import { getSessionUserId, getSessionRole } from "../auth/session";
import { Button } from "../components/Button";
import { ErrorBanner } from "../components/AsyncPageFeedback";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { ro },
});

type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Sedinta;
};

function SedintePage() {
  const navigate = useNavigate();
  const myUserId = getSessionUserId();
  const myRole = getSessionRole();
  const normalizedRole = myRole.trim().toLowerCase();
  const isManager = normalizedRole === "manager";
  const isSuperAdmin = normalizedRole === "superadmin";
  const isManagerOrAdmin = isManager || isSuperAdmin;

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [calendarView, setCalendarView] = useState<View>("month");
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  const load = useCallback(async () => {
    if (myUserId == null) return;
    setIsLoading(true);
    setError("");

    const result = await getSedinteAllData();

    setIsLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    const mapped: CalendarEvent[] = result.data.map((s) => ({
      id: s.id,
      title:
        s.userId === myUserId || isManagerOrAdmin
          ? `${format(new Date(s.startAt), "HH:mm")} - ${format(new Date(s.endAt), "HH:mm")} | ${
              s.isTeamMeeting ? `🏢 Ședință echipă - ${s.numeConsultant}` : s.numeConsultant
            }`
          : `${format(new Date(s.startAt), "HH:mm")} - ${format(new Date(s.endAt), "HH:mm")} | Ocupat`,
      start: new Date(s.startAt),
      end: new Date(s.endAt),
      resource: s,
    }));
    setEvents(mapped);
  }, [isManagerOrAdmin, myUserId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Ștergi această ședință?");
    if (!ok) return;
    setActionError("");
    const result = await deleteSedintaData(id);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    setSelectedEvent(null);
    void load();
  };

  const canManage = (s: Sedinta) => {
    if (isSuperAdmin) return true;
    if (isManager) return true;
    return s.userId === myUserId;
  };

  const canViewDetails = (s: Sedinta) => {
    if (isSuperAdmin) return true;
    if (isManager) return true;
    return s.userId === myUserId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 rounded-3xl border border-amber-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                Organizare ședințe
              </p>
              <h1 className="text-4xl font-extrabold text-amber-900 sm:text-5xl">
                Ședințe
              </h1>
              <p className="mt-2 text-sm text-amber-700">
                Calendarul ședințelor tale.
              </p>
            </div>
            <div className="flex gap-2">
              <Button shadow size="sm" onClick={() => navigate("/sedinte/add")}>
                Adaugă ședință
              </Button>
              {isManagerOrAdmin && (
                <Button shadow size="sm" variant="secondary" onClick={() => navigate("/sedinte/team-meeting")}>
                  Ședință echipă
                </Button>
              )}
            </div>
          </div>
        </div>

        <ErrorBanner message={error} />
        <ErrorBanner message={actionError} />

        {selectedEvent && (
          <div className="mb-6 rounded-2xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-amber-900 text-lg">
                  {canViewDetails(selectedEvent.resource)
                    ? selectedEvent.title
                    : "Ședință ocupată"}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {format(selectedEvent.start, "dd MMM yyyy HH:mm", { locale: ro })} →{" "}
                  {format(selectedEvent.end, "HH:mm", { locale: ro })}
                </p>
                {canViewDetails(selectedEvent.resource) && selectedEvent.resource.observatii && (
                  <p className="text-sm text-amber-600 mt-2">{selectedEvent.resource.observatii}</p>
                )}
                {!canViewDetails(selectedEvent.resource) && (
                  <p className="text-sm text-amber-600 mt-2">
                    Detaliile acestei ședințe sunt vizibile doar pentru utilizatorul care a creat-o.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {canManage(selectedEvent.resource) && (
                  <>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => navigate(`/sedinte/edit/${selectedEvent.id}`)}
                    >
                      Editează
                    </Button>
                    <Button
                      size="xs"
                      variant="danger"
                      onClick={() => handleDelete(selectedEvent.id)}
                    >
                      Șterge
                    </Button>
                  </>
                )}
                <Button size="xs" variant="secondary" onClick={() => setSelectedEvent(null)}>
                  ✕
                </Button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center text-sm text-amber-700">
            Se încarcă calendarul…
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              culture="ro"
              popup
              popupOffset={8}
              dayLayoutAlgorithm="no-overlap"
              views={["month", "week", "day", "agenda"]}
              view={calendarView}
              date={calendarDate}
              onView={(nextView) => setCalendarView(nextView)}
              onNavigate={(nextDate) => setCalendarDate(nextDate)}
              onShowMore={(_, date) => {
                setCalendarDate(date);
                setCalendarView("day");
              }}
              onSelectEvent={(event) => setSelectedEvent(event)}
              eventPropGetter={(event) => {
                const isOwn = event.resource.userId === myUserId;
                const isTeam = event.resource.isTeamMeeting;
                const canSee = canViewDetails(event.resource);
              
                return {
                  style: {
                    backgroundColor: !canSee
                      ? "#fef3c7"
                      : isTeam
                      ? "#d97706"
                      : isOwn
                      ? "#fbbf24"
                      : "#fdba74",
                    color: !canSee ? "#92400e" : isTeam ? "#fff" : "#1c1917",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: "500",
                    opacity: !canSee ? 0.7 : 1,
                  },
                };
              }}
              messages={{
                today: "Azi",
                previous: "Înapoi",
                next: "Înainte",
                month: "Lună",
                week: "Săptămână",
                day: "Zi",
                agenda: "Agendă",
                noEventsInRange: "Nicio ședință în acest interval.",
              }}
            />
            <div className="mt-3 pt-3 border-t border-amber-100 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs text-amber-700">
                <span className="w-3 h-3 rounded-sm bg-amber-300 inline-block"></span>
                Ședința mea
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-700">
                <span className="w-3 h-3 rounded-sm bg-amber-600 inline-block"></span>
                Ședință echipă
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-700">
                <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300 inline-block"></span>
                Ocupat
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SedintePage;