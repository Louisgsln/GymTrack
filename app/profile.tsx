import { Page, Label, Card, Button, Row } from '../src/components/ui';
import { useTranslation } from '../src/i18n/useTranslation';
import { usePreferences, type Preferences } from '../src/store/preferences';
import { useServices } from '../src/providers/AppProvider';
import { useAction } from '../src/hooks/useAction';
export default function Profile() {
  const t = useTranslation();
  const preferences = usePreferences();
  const { settings } = useServices();
  const { run, pending, error } = useAction();
  const update = (patch: Partial<Preferences>) => {
    void run(async () => {
      const next = { ...usePreferences.getState(), ...patch };
      await settings.save(next);
      usePreferences.setState(next);
    });
  };
  return (
    <Page>
      <Label large>{t('profile')}</Label>
      <Card>
        <Label>{t('localMode')}</Label>
        <Label muted>{t('localDetails')}</Label>
      </Card>
      <Card>
        <Label>{t('theme')}</Label>
        <Row>
          {(['system', 'dark', 'light'] as const).map((theme) => (
            <Button
              key={theme}
              title={t(theme)}
              secondary={preferences.theme !== theme}
              disabled={pending}
              onPress={() => update({ theme })}
            />
          ))}
        </Row>
      </Card>
      <Card>
        <Label>{t('language')}</Label>
        <Row>
          <Button
            title={t('french')}
            secondary={preferences.locale !== 'fr'}
            disabled={pending}
            onPress={() => update({ locale: 'fr' })}
          />
          <Button
            title={t('english')}
            secondary={preferences.locale !== 'en'}
            disabled={pending}
            onPress={() => update({ locale: 'en' })}
          />
        </Row>
      </Card>
      <Card>
        <Label>{t('units')}</Label>
        <Row>
          {(['kg', 'lb'] as const).map((weightUnit) => (
            <Button
              key={weightUnit}
              title={weightUnit}
              secondary={preferences.weightUnit !== weightUnit}
              disabled={pending}
              onPress={() => update({ weightUnit })}
            />
          ))}
        </Row>
      </Card>
      <Card>
        <Label>{t('effort')}</Label>
        <Row>
          {(['RPE', 'RIR', 'OFF'] as const).map((effort) => (
            <Button
              key={effort}
              title={effort === 'OFF' ? t('off') : effort}
              secondary={preferences.effort !== effort}
              disabled={pending}
              onPress={() => update({ effort })}
            />
          ))}
        </Row>
      </Card>
      {error && <Label>{t('error')}</Label>}
    </Page>
  );
}
