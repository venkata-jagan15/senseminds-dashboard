import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt

# ------------------------------------
# Load deterministic analytics output
# ------------------------------------

df = pd.read_csv("deterministic_analytics_output.csv")

# ------------------------------------
# Create Knowledge Graph
# ------------------------------------

G = nx.DiGraph()

for _, row in df.iterrows():

    equipment = "Scrubber"

    if "Equipment" in df.columns:
        equipment = str(row["Equipment"])

    elif "Scrubber" in df.columns:
        equipment = str(row["Scrubber"])

    else:
        equipment = "SCB-101"

    # Equipment Node
    G.add_node(equipment, type="Equipment")

    # ----------------------------
    # Sensor Nodes
    # ----------------------------

    G.add_node("Average_pH", type="Sensor")
    G.add_edge(equipment, "Average_pH", relation="has_sensor")

    G.add_node("VOC", type="Sensor")
    G.add_edge(equipment, "VOC", relation="has_sensor")

    # ----------------------------
    # Threshold Nodes
    # ----------------------------

    ph_threshold = str(row["pH_Threshold"])
    voc_threshold = str(row["VOC_Threshold"])

    G.add_node(ph_threshold, type="Threshold")
    G.add_node(voc_threshold, type="Threshold")

    G.add_edge("Average_pH", ph_threshold,
               relation="threshold")

    G.add_edge("VOC", voc_threshold,
               relation="threshold")

    # ----------------------------
    # Trend Nodes
    # ----------------------------

    ph_trend = str(row["pH_Trend"])
    voc_trend = str(row["VOC_Trend"])

    G.add_node(ph_trend, type="Trend")
    G.add_node(voc_trend, type="Trend")

    G.add_edge("Average_pH",
               ph_trend,
               relation="trend")

    G.add_edge("VOC",
               voc_trend,
               relation="trend")

    # ----------------------------
    # Health Node
    # ----------------------------

    health = "Health_" + str(row["Health_Score"])

    G.add_node(health, type="Health")

    G.add_edge(equipment,
               health,
               relation="health")

    # ----------------------------
    # Alert Node
    # ----------------------------

    alert = str(row["Alert"])

    G.add_node(alert, type="Alert")

    G.add_edge(equipment,
               alert,
               relation="alert")

    # ----------------------------
    # Engineering Finding
    # ----------------------------

    finding = str(row["Engineering_Finding"])

    G.add_node(finding,
               type="Finding")

    G.add_edge(equipment,
               finding,
               relation="finding")

    # ----------------------------
    # Root Cause Rules
    # ----------------------------

    if finding == "Reduced Scrubber Efficiency":

        cause = "Low Alkali Dosing"

        action = "Check Alkali Dosing Pump"

    elif finding == "Poor VOC Absorption":

        cause = "VOC Absorption Issue"

        action = "Inspect Packing Material"

    elif finding == "Low Alkali Dosing":

        cause = "Chemical Supply Low"

        action = "Increase Alkali Flow"

    else:

        cause = "Normal Operation"

        action = "Continue Monitoring"

    G.add_node(cause, type="Cause")
    G.add_node(action, type="Action")

    G.add_edge(finding,
               cause,
               relation="caused_by")

    G.add_edge(cause,
               action,
               relation="recommend")

# ------------------------------------
# Graph Summary
# ------------------------------------

print("="*60)
print("KNOWLEDGE GRAPH")
print("="*60)

print("Nodes :", G.number_of_nodes())
print("Edges :", G.number_of_edges())

print("\nRelationships\n")

for u, v, d in G.edges(data=True):
    print(f"{u} --[{d['relation']}]--> {v}")

# ------------------------------------
# Draw Graph
# ------------------------------------

plt.figure(figsize=(18,12))

pos = nx.spring_layout(G, k=1.2, seed=42)

nx.draw_networkx_nodes(
    G,
    pos,
    node_size=1800
)

nx.draw_networkx_edges(
    G,
    pos,
    arrows=True
)

nx.draw_networkx_labels(
    G,
    pos,
    font_size=8
)

edge_labels = nx.get_edge_attributes(G, "relation")

nx.draw_networkx_edge_labels(
    G,
    pos,
    edge_labels=edge_labels,
    font_size=7
)

plt.title("SenseMinds Knowledge Graph")

plt.axis("off")

plt.show()