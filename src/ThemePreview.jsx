// Throwaway mock screen — just to preview the noirab theme, not a real feature.
import {
  View,
  Text,
  Badge,
  Card,
  Container,
  Grid,
  Divider,
  Avatar,
  FormControl,
  TextField,
  Button,
} from 'reshaped'

const stats = [
  { label: 'TASKS', value: '12', delta: '+3 today', color: 'primary', glow: 'glow-primary' },
  { label: 'IN REVIEW', value: '4', delta: 'needs input', color: 'warning', glow: 'glow-accent' },
  { label: 'SHIPPED', value: '27', delta: 'all time', color: 'positive', glow: 'glow-positive' },
]

const tasks = [
  { name: 'Auth module', status: 'Complete', color: 'positive' },
  { name: 'Dashboard UI', status: 'In progress', color: 'warning' },
  { name: 'API integration', status: 'Blocked', color: 'critical' },
]

export default function ThemePreview() {
  return (
    <View backgroundColor="page" height="100vh" attributes={{ style: { overflowY: 'auto' } }}>
      <Container width="720px" padding={8}>
        <View gap={8}>
          <View direction="row" justify="space-between" align="center">
            <Text variant="featured-6" weight="bold">
              noirab
            </Text>
            <View direction="row" gap={3} align="center">
              <Badge className="glow-primary" color="primary" variant="faded">
                v0.1 — theme preview
              </Badge>
              <Avatar initials="AB" size={8} color="primary" />
            </View>
          </View>

          <View gap={2}>
            <Text variant="featured-1">Take-home assignment workspace</Text>
            <Text variant="body-2" color="neutral-faded">
              A themed shell, ready for whatever spec lands next.
            </Text>
          </View>

          <Grid columns={3} gap={4}>
            {stats.map((stat) => (
              <Card key={stat.label} padding={4} className={stat.glow}>
                <View gap={1}>
                  <Text variant="caption-1" color="neutral-faded" monospace>
                    {stat.label}
                  </Text>
                  <Text variant="featured-2">{stat.value}</Text>
                  <Badge size="small" color={stat.color} variant="faded">
                    {stat.delta}
                  </Badge>
                </View>
              </Card>
            ))}
          </Grid>

          <Card padding={6}>
            <View gap={4}>
              <Text variant="featured-6" weight="semibold">
                Task status
              </Text>
              <Divider />
              <View gap={3}>
                {tasks.map((task, i) => (
                  <View key={task.name} gap={3}>
                    <View direction="row" justify="space-between" align="center">
                      <Text variant="body-2">{task.name}</Text>
                      <Badge color={task.color} variant="faded">
                        {task.status}
                      </Badge>
                    </View>
                    {i < tasks.length - 1 && <Divider />}
                  </View>
                ))}
              </View>
            </View>
          </Card>

          <Card padding={6}>
            <View gap={4}>
              <Text variant="featured-6" weight="semibold">
                Quick note
              </Text>
              <FormControl>
                <TextField name="note" placeholder="Add a note..." />
              </FormControl>
              <View direction="row" justify="end">
                <Button className="glow-primary" color="primary">
                  Save
                </Button>
              </View>
            </View>
          </Card>

          <Text variant="caption-1" color="neutral-faded" align="center">
            noirab_hw · theme preview · not part of the final assignment
          </Text>
        </View>
      </Container>
    </View>
  )
}
