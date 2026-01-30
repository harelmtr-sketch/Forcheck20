import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';

type SaveTemplateButtonProps = {
  onSaveTemplate: () => void;
  onArchiveDay: () => void;
};

export function SaveTemplateButton({ onSaveTemplate, onArchiveDay }: SaveTemplateButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSaveTemplate = () => {
    setOpen(false);
    onSaveTemplate();
  };

  const handleArchive = () => {
    setOpen(false);
    onArchiveDay();
  };

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.trigger}>
        <Text style={styles.triggerText}>Save as Template</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Quick Actions</Text>
              <Pressable onPress={() => setOpen(false)} style={styles.closeButton}>
                <X size={16} color="#94a3b8" />
              </Pressable>
            </View>
            <Pressable onPress={handleSaveTemplate} style={styles.sheetRow}>
              <Text style={styles.sheetRowText}>Save as Template</Text>
            </Pressable>
            <Pressable onPress={handleArchive} style={[styles.sheetRow, styles.sheetRowLast]}>
              <Text style={styles.sheetRowText}>Archive Day</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#1f232c',
    paddingVertical: 12,
    alignItems: 'center'
  },
  triggerText: {
    color: '#f8fafc',
    fontWeight: '600'
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(10,13,18,0.7)'
  },
  sheet: {
    backgroundColor: '#1a1d23',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sheetTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700'
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sheetRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  sheetRowLast: {
    borderBottomWidth: 0
  },
  sheetRowText: {
    color: '#f8fafc',
    fontWeight: '600'
  }
});
