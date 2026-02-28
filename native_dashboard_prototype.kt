
package com.techshack.tcems.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.jan-tennert.supabase.SupabaseClient
import io.github.jan-tennert.supabase.postgrest.from
import kotlinx.coroutines.launch

// --- NATIVE DESIGN TOKENS ---
val LttOrange = Color(0xFFF15A24)
val BgCarbon = Color(0xFF0D0D0D)
val BgSlate = Color(0xFF1A1A1A)
val TextMuted = Color(0xFFA0A0A0)
val GlassBorder = Color(255, 255, 255, 25)

@Composable
fun DashboardScreen(supabase: SupabaseClient) {
    val scope = rememberCoroutineScope()
    var dailyRevenue by remember { mutableStateOf(0.0) }
    var activeTickets by remember { mutableStateOf(0) }
    var isLoading by remember { mutableStateOf(false) }

    // FETCH LOGIC (Native Coroutines)
    LaunchedEffect(Unit) {
        isLoading = true
        scope.launch {
            try {
                // Example Fetch: Daily Revenue via Supabase Postgrest-kt
                val response = supabase.from("payments").select().execute()
                // ... processing data ...
                dailyRevenue = 5450.0 // Mock for prototype UI
                activeTickets = 12
            } catch (e: Exception) {
                // Handle Error
            } finally {
                isLoading = false
            }
        }
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = BgCarbon
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp)
        ) {
            // HEADER
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "WAR ROOM DASHBOARD",
                        color = Color.White,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black
                    )
                    Text(
                        text = "REAL-TIME ENTERPRISE INTELLIGENCE > V2.4A",
                        color = TextMuted,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp
                    )
                }
                
                // SYNC INDICATOR
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = LttOrange,
                    strokeWidth = 2.dp
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // PERFORMANCE GAUGE (Glass Surface)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp),
                shape = RoundedCornerShape(24.dp),
                border = AssistChipDefaults.assistChipBorder(enabled = true, borderColor = GlassBorder),
                colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.03f))
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    Text(
                        text = "DAILY PERFORMANCE VELOCITY",
                        color = TextMuted,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black
                    )
                    
                    Text(
                        text = "₱${dailyRevenue.toInt()}",
                        color = Color.White,
                        fontSize = 58.sp,
                        fontWeight = FontWeight.Black
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    // NATIVE PROGRESS BAR
                    LinearProgressIndicator(
                        progress = { 0.77f },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(12.dp),
                        color = LttOrange,
                        trackColor = Color.White.copy(alpha = 0.05f),
                        strokeCap = androidx.compose.ui.graphics.StrokeCap.Round
                    )
                    
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("ALPHA BASELINE", color = TextMuted, fontSize = 9.sp)
                        Text("DAILY CAP", color = Color.White, fontSize = 9.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // STATS GRID
            val stats = listOf(
                "MTD REVENUE" to "₱142,800",
                "ACTIVE QUEUE" to activeTickets.toString(),
                "EFFICIENCY" to "98.5%",
                "INVESTOR YIELD" to "₱28,400"
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(stats) { item ->
                    StatCard(label = item.first, value = item.second)
                }
            }
        }
    }
}

@Composable
fun StatCard(label: String, value: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.03f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(label, color = TextMuted, fontSize = 10.sp, fontWeight = FontWeight.Black)
            Text(value, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
        }
    }
}
