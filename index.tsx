import React, {useState} from "react"
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from "react-native"
import SelectedCircle from "./assets/selectedCircle.svg"
import Circle from "./assets/circle.svg"

export type DropDownOption = {
  label: string
  badge?: string
}

type Props = {
  label?: string
  placeholder?: string
  options: DropDownOption[]
  onSelect?: (val: string | string[]) => void
  header?: string
  circleSelected?: boolean
  isConstantPlaceHolder?: boolean
  tickSelected?: boolean
  isMultiple?: boolean
  showButton?: boolean
  buttonStyle?: ViewStyle
  textStyle?: TextStyle
  selected?: string | string[]
}

const Dropdown2: React.FC<Props> = ({
  label,
  placeholder,
  options,
  onSelect,
  isMultiple,
  showButton = false,
  header,
  isConstantPlaceHolder = false,
  circleSelected = false,
  tickSelected = false,
  buttonStyle,
  textStyle,
  selected,
}) => {
  const [open, setOpen] = useState(false)
  const [internalSelected, setInternalSelected] = useState<string | null>(null)
  const [internalSelectedValues, setInternalSelectedValues] = useState<
    string[]
  >([])

  const screenWidth = Dimensions.get("window").width
  const currentSelected = isMultiple
    ? ((selected as string[]) ?? internalSelectedValues)
    : ((selected as string) ?? internalSelected)

  const handleSelect = (value: string) => {
    if (isMultiple) {
      const current = (selected as string[]) ?? internalSelectedValues

      let newSelected: string[] = []

      if (current.includes(value)) {
        newSelected = current.filter((v) => v !== value)
      } else {
        newSelected = [...current, value]
      }

      if (!selected) {
        setInternalSelectedValues(newSelected)
      }

      onSelect?.(newSelected)
    } else {
      if (!selected) {
        setInternalSelected(value)
      }

      onSelect?.(value)
      setOpen(false)
    }
  }

  const displayValue = isMultiple
    ? currentSelected && currentSelected.length > 0
      ? (currentSelected as string[]).join(", ")
      : placeholder
    : currentSelected || placeholder

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        style={[styles.trigger, buttonStyle]}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[
            styles.triggerText,
            !selected && styles.placeholderText,
            textStyle,
          ]}
          numberOfLines={1}
        >
          {isConstantPlaceHolder ? placeholder : displayValue}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        animationType="fade"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        <View style={styles.centeredContainer}>
          <View
            style={[styles.sheet, {width: Math.min(300, screenWidth - 40)}]}
          >
            {header && (
              <View style={styles.headerContainer}>
                <Text style={styles.headerContainerText}> {header}</Text>
              </View>
            )}

            {label && <Text style={styles.sheetTitle}>{label}</Text>}
            <FlatList
              data={options ?? []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => {
                const active = isMultiple
                  ? (currentSelected as string[])?.includes(item.label)
                  : item.label === currentSelected

                return (
                  <Pressable
                    onPress={() => handleSelect(item.label)}
                    style={({pressed}) => [
                      styles.option,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <View style={styles.optionContent}>
                      {circleSelected && (
                        <View style={styles.iconContainer}>
                          {active ? (
                            <SelectedCircle width={20} height={20} />
                          ) : (
                            <Circle width={20} height={20} />
                          )}
                        </View>
                      )}

                      <Text
                        style={[
                          styles.optionLabel,
                          active && styles.optionLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    <View style={styles.rightSection}>
                      {item.badge && (
                        <Text style={styles.badge}>({item.badge})</Text>
                      )}
                      {active && tickSelected && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </Pressable>
                )
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContent}
            />
            {showButton && (
              <Pressable
                style={styles.buttonContainer}
                onPress={() => setOpen(false)}
              >
                <Text>Kapat</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Dropdown2

const styles = StyleSheet.create({
  container: {width: "auto"},
  label: {fontSize: 14, color: "#333", marginBottom: 6},
  trigger: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DADCE0", //
    paddingHorizontal: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  triggerText: {flex: 1, fontSize: 16, color: "#111"},
  placeholderText: {color: "#8E8E93"},
  chevron: {fontSize: 18, marginLeft: 8},
  backdrop: {flex: 1, backgroundColor: "#00000066"},
  centeredContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    maxHeight: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 6,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  headerContainer: {
    backgroundColor: "#F2F3F5",
    paddingTop: 10,
    alignItems: "center",
    width: "100%",
  },
  headerContainerText: {
    fontSize: 18,
    fontWeight: "500",
    borderBottomWidth: 1,
    borderBottomColor: "#616262",
    paddingBottom: 10,
    width: "80%",
    textAlign: "center",
  },
  listContent: {paddingVertical: 6},

  optionLabel: {fontSize: 16, color: "#111"},
  optionLabelActive: {fontWeight: "600"},
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#EEE",
    marginLeft: 16,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionPressed: {backgroundColor: "#F7F7F7"},
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 60,
  },
  badge: {
    fontSize: 14,
    color: "#666",
    marginRight: 6,
  },
  checkmark: {
    fontSize: 18,
    color: "#000",
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "#666",
    padding: 10,
    margin: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
})
