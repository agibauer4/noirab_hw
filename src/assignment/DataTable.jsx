import { View, Text, Card, Badge } from 'reshaped'

// Maps a magnitude to a step on the sequential loss ramp defined in
// assignment.css. Thresholds are fixed (not relative to the data) so the same
// value always gets the same color across every figure on the page.
function lossStep(value) {
  if (value >= 30) return 'var(--loss-5)'
  if (value >= 20) return 'var(--loss-4)'
  if (value >= 12) return 'var(--loss-3)'
  if (value >= 7) return 'var(--loss-2)'
  return 'var(--loss-1)'
}

// Keeps a column of figures to a consistent number of decimal places, so 8.0
// doesn't print as "8" next to a neighbouring "5.7". Non-numeric values (the
// pre-formatted ratio strings) pass through untouched.
function fmt(value, decimals) {
  return typeof value === 'number' ? value.toFixed(decimals) : value
}

function Bar({ value, max, suffix = '%', decimals = 1, emphasis }) {
  const width = Math.max((value / max) * 100, 1.5)
  return (
    <View direction="row" align="center" gap={2} className="data-bar-row">
      <View.Item grow className="data-bar-track">
        <span
          className="data-bar"
          style={{ width: `${width}%`, background: lossStep(value) }}
        />
      </View.Item>
      <Text
        variant="caption-1"
        monospace
        color={emphasis ? 'warning' : 'neutral'}
        weight={emphasis ? 'bold' : 'regular'}
        className="data-bar-value"
      >
        {fmt(value, decimals)}
        {suffix}
      </Text>
    </View>
  )
}

/**
 * A table where one column is rendered as a bar chart.
 *
 * columns: array of { key, header, align, type }
 *   type 'step'  — small monospace index
 *   type 'label' — the row name
 *   type 'num'   — right-aligned tabular figure
 *   type 'bar'   — bar + printed value (needs `max` on the column)
 */
export default function DataTable({ title, subtitle, columns, rows, caption }) {
  return (
    <Card padding={4}>
      <View gap={3}>
        <View gap={1}>
          <Text variant="body-3" weight="medium">
            {title}
          </Text>
          {subtitle && (
            <Text variant="caption-1" color="neutral-faded" monospace>
              {subtitle}
            </Text>
          )}
        </View>

        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={col.type === 'num' ? 'data-num' : undefined}
                  >
                    <Text variant="caption-2" color="neutral-faded" monospace>
                      {col.header}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.key ?? i}>
                  {columns.map((col) => {
                    const value = row[col.key]

                    if (col.type === 'step') {
                      return (
                        <td key={col.key} className="data-step">
                          <Text variant="caption-1" color="neutral-faded" monospace>
                            {value}
                          </Text>
                        </td>
                      )
                    }

                    if (col.type === 'label') {
                      return (
                        <td key={col.key} className="data-label">
                          <View direction="row" gap={2} align="center">
                            <Text
                              variant="body-3"
                              color={row.worst ? 'warning' : 'neutral'}
                              weight={row.worst ? 'medium' : 'regular'}
                            >
                              {value}
                            </Text>
                            {row.gloss && (
                              <Text variant="caption-1" color="neutral-faded">
                                {row.gloss}
                              </Text>
                            )}
                            {row.worst && col.badge && (
                              <Badge size="small" color="critical" variant="faded">
                                {col.badge}
                              </Badge>
                            )}
                          </View>
                        </td>
                      )
                    }

                    if (col.type === 'bar') {
                      return (
                        <td key={col.key} className="data-bar-cell">
                          <Bar
                            value={value}
                            max={col.max}
                            suffix={col.suffix}
                            decimals={col.decimals ?? 1}
                            emphasis={row.worst || row.hot}
                          />
                        </td>
                      )
                    }

                    return (
                      <td key={col.key} className="data-num">
                        <Text
                          variant="caption-1"
                          monospace
                          color={col.emphasis && row.hot ? 'warning' : 'neutral'}
                        >
                          {fmt(value, col.decimals ?? (col.suffix === '%' ? 1 : 0))}
                          {col.suffix ?? ''}
                        </Text>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {caption && (
          <Text variant="caption-1" color="neutral-faded">
            {caption}
          </Text>
        )}
      </View>
    </Card>
  )
}
