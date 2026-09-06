import * as styles from '../../styles/events/EventsStyles';
import DateRangeGrid from './DateRangeGrid';
import { motion, AnimatePresence } from "framer-motion";

export default function EventsFilters({
  filters,
  setFilters,
  activeTab,
  setActiveTab,
  activeFiltersCount,
  openPanel,
  setOpenPanel
}) {
  return (
    <>
      {/* Top controls: Tabs + Search + Filters */}
      <styles.TopBar>
        <styles.FilterBar role='tablist' aria-label='Event type tabs'>
          {['All', 'PRIVATE_PARTY', 'PUBLIC_PARTY', 'FAMILY_EVENT'].map((name) => (
            <styles.FilterTabButton
              key={name}
              type='button'
              role='tab'
              aria-selected={activeTab === name}
              $active={activeTab === name}
              onClick={() => setActiveTab(name)}
            >
              {name}
            </styles.FilterTabButton>
          ))}
        </styles.FilterBar>

        <styles.RightControls>
          <styles.SearchInput
            placeholder='Search title, description, city, tags...'
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            aria-label='Search events'
          />
          <styles.FilterToggle
            type='button'
            onClick={() => setOpenPanel((s) => !s)}
            aria-expanded={openPanel}
            aria-controls='filters-panel'
            title='Open filters'
          >
            ⚙️ Filters
            {activeFiltersCount > 0 && (
              <styles.Badge aria-label={`${activeFiltersCount} active filters`}>
                {activeFiltersCount}
              </styles.Badge>
            )}
          </styles.FilterToggle>
        </styles.RightControls>
      </styles.TopBar>

      {/* Filters Panel with animation */}
      <AnimatePresence>
        {openPanel && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <styles.PanelOverlay onClick={() => setOpenPanel(false)}>
              <motion.div
                key="panel"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <styles.Panel
                  id='filters-panel'
                  onClick={(e) => e.stopPropagation()}
                  role='dialog'
                  aria-modal='true'
                  aria-label='Filters'
                >
                  <styles.PanelHeader>
                    <h3>Refine Results</h3>
                    <styles.SmallNote>Choose any combination, results update live.</styles.SmallNote>
                  </styles.PanelHeader>

                  <styles.PanelGrid>
                    {/* 1) Types */}
                    <styles.Field>
                      <styles.Label>Types</styles.Label>
                      <styles.TypeChips>
                        {['PRIVATE_PARTY', 'PUBLIC_PARTY', 'FAMILY_EVENT'].map((t) => {
                          const on = filters.types.has(t);
                          return (
                            <styles.Chip
                              key={t}
                              $on={on}
                              onClick={() =>
                                setFilters((f) => {
                                  const next = new Set(f.types);
                                  if (on) next.delete(t);
                                  else next.add(t);
                                  return { ...f, types: next };
                                })
                              }
                            >
                              {t}
                            </styles.Chip>
                          );
                        })}
                      </styles.TypeChips>
                      <styles.Hint>Tab selection also filters by type.</styles.Hint>
                    </styles.Field>

                    {/* 2) Search & Location */}
                    <styles.Field>
                      <styles.Label>Quick search</styles.Label>
                      <styles.Input
                        placeholder='music, workshop, after party...'
                        value={filters.query}
                        onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                      />
                      <styles.Label style={{ marginTop: '0.25rem' }}>City / Location contains</styles.Label>
                      <styles.Input
                        placeholder='e.g., Jerusalem, Tel Aviv...'
                        value={filters.city}
                        onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                      />
                    </styles.Field>

                    {/* 3) Dates */}
                    <styles.Field style={{ gridColumn: '1 / -1' }}>
                      <styles.Label>Dates</styles.Label>
                      <DateRangeGrid
                        size='xs'
                        defaultMode='single'
                        from={filters.dateFrom}
                        to={filters.dateTo}
                        onChange={(nextFrom, nextTo) =>
                          setFilters((f) => ({
                            ...f,
                            dateFrom: nextFrom,
                            dateTo: nextTo,
                          }))
                        }
                      />
                    </styles.Field>

                    {/* 4) Times */}
                    <styles.Field>
                      <styles.Label>Times</styles.Label>
                      <styles.Row>
                        <styles.Input
                          type='time'
                          value={filters.timeFrom}
                          onChange={(e) => setFilters((f) => ({ ...f, timeFrom: e.target.value }))}
                        />
                        <styles.Input
                          type='time'
                          value={filters.timeTo}
                          onChange={(e) => setFilters((f) => ({ ...f, timeTo: e.target.value }))}
                        />
                      </styles.Row>
                    </styles.Field>

                    {/* 5) Price (+ Free) */}
                    <styles.Field>
                      <styles.Label>Price</styles.Label>
                      <styles.Row style={{ gridTemplateColumns: 'auto 1fr 1fr' }}>
                        <styles.CheckboxLabel>
                          <input
                            type='checkbox'
                            checked={filters.isFree}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                isFree: e.target.checked,
                              }))
                            }
                          />
                          <span>Free only</span>
                        </styles.CheckboxLabel>
                        <styles.Input
                          type='number'
                          min='0'
                          step='1'
                          placeholder='Min'
                          value={filters.priceMin}
                          onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
                          disabled={filters.isFree}
                        />
                        <styles.Input
                          type='number'
                          min='0'
                          step='1'
                          placeholder='Max'
                          value={filters.priceMax}
                          onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
                          disabled={filters.isFree}
                        />
                      </styles.Row>
                    </styles.Field>

                    {/* 6) Tags */}
                    <styles.Field style={{ gridColumn: '1 / -1' }}>
                      <styles.Label>Tags (comma separated)</styles.Label>
                      <styles.Input
                        placeholder='music, tech, networking...'
                        value={filters.tagsText}
                        onChange={(e) => setFilters((f) => ({ ...f, tagsText: e.target.value }))}
                      />
                    </styles.Field>

                    {/* 7) Sort */}
                    <styles.Field>
                      <styles.Label>Sort by</styles.Label>
                      <styles.Select
                        value={filters.sort}
                        onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                      >
                        <option value='dateAsc'>Date (soonest first)</option>
                        <option value='dateDesc'>Date (latest first)</option>
                        <option value='priceAsc'>Price (low → high)</option>
                        <option value='priceDesc'>Price (high → low)</option>
                        <option value='title'>Title (A→Z)</option>
                      </styles.Select>
                    </styles.Field>
                  </styles.PanelGrid>

                  <styles.PanelFooter>
                    <styles.MiniButton
                      type='button'
                      onClick={() => {
                        setFilters({
                          query: '',
                          types: new Set(),
                          dateFrom: '',
                          dateTo: '',
                          timeFrom: '',
                          timeTo: '',
                          city: '',
                          isFree: false,
                          priceMin: '',
                          priceMax: '',
                          tagsText: '',
                          sort: 'dateAsc',
                        });
                        setActiveTab('All');
                      }}
                    >
                      Clear all
                    </styles.MiniButton>
                    <styles.MiniButton type='button' onClick={() => setOpenPanel(false)}>
                      Close
                    </styles.MiniButton>
                  </styles.PanelFooter>
                </styles.Panel>
              </motion.div>
            </styles.PanelOverlay>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}